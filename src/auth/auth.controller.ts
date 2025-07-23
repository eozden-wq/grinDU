import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    return req.logout();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Request() req: any) {
    return this.authService.createUser(req.body.email, req.body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  test(@Request() req: any) {
    return 'You\'re authenticated!';
  }
}
