import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Response,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: "User's email", example: 'foo@bar.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "User's password", example: 'ABC123@!@#' })
  @IsStrongPassword()
  password: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: CreateUserDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    return this.authService.createUser(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: "You're authenticated" })
  @ApiUnauthorizedResponse({ description: "You're not authenticated" })
  @ApiBearerAuth()
  @Get('test')
  test(@Request() req: any) {
    return "You're authenticated!";
  }
}
