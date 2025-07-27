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

  async privateProfile(userUUID: string): Promise<UserProfile | null> {
    return this.prisma.user.findUnique({ where: { id: userUUID } }).profile();
  }

  async publicProfile(profileID: number): Promise<any | null> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { id: profileID },
    });

    if (!profile) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Profile not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const { isVerified, ...data } = profile;
    return data;
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

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }

  async updateUserProfile(id: string, patchProfileDTO: PatchProfileDTO) {
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
}
