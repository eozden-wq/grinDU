import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as assert from 'node:assert';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.user({ email: email });

    if (!user) {
      return null;
    }

    if (await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createUser(email: string, pass: string): Promise<any> {
    if (await this.usersService.user({ email })) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User with this email already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(pass, saltRounds);
    const user = await this.usersService.createUser({
      id: uuidv4(),
      email,
      password: hash,
      profile: { create: { isVerified: false } },
    });

    assert(user);

    const { password, ...result } = user;

    return result;
  }
}
