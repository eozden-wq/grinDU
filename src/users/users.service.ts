import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma, User, UserProfile } from '@prisma/client';
import { PrismaService } from '../core/prisma.service';
import { PatchProfileDTO } from './users.controller';
import * as assert from 'node:assert';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({ where: userWhereUniqueInput });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({ data, where });
  }

  // Only delete the user's profile and the user's account - We want to keep the groups created and any other
  // data pertaining to created groups by the user
  async deleteUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<void> {
    await this.prisma.user.delete({ where: userWhereUniqueInput });
    await this.prisma.userProfile.delete({
      where: { id: userWhereUniqueInput.userProfileId },
    });
  }

  async updateUserProfile(
    id: string,
    patchProfileDTO: PatchProfileDTO,
  ): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    assert(user);

    const profileId = user.userProfileId;

    if (patchProfileDTO.dateOfBirth) {
      const dateOfBirth = new Date(patchProfileDTO.dateOfBirth);
      if (dateOfBirth.getTime() > Date.now()) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Date of birth cannot be in the future',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return this.prisma.userProfile.update({
      where: {
        id: profileId,
      },
      data: {
        ...patchProfileDTO,
      },
    });
  }

  async userProfile(
    where: Prisma.UserProfileWhereUniqueInput,
  ): Promise<any | null> {
    const profile = await this.prisma.userProfile.findUnique({ where });
    assert(profile);

    const {isVerified, ...result} = profile;
    return result;
  }
}
