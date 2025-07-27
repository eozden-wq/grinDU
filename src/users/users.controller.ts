import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Patch,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsISO8601, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PatchProfileDTO {
  @ApiProperty({ description: "User's first names", example: 'John' })
  @IsOptional()
  firstNames?: string;

  @ApiProperty({ description: "User's last names", example: 'Smith' })
  @IsOptional()
  lastNames?: string;

  @ApiProperty({ description: "User's preferred names", example: 'Joe' })
  @IsOptional()
  preferredNames?: string;

  @ApiProperty({
    description: "User's date of birth in ISO-8601 format",
    example: new Date('2004-09-12T00:00:00.000Z'),
  })
  @IsOptional()
  @IsISO8601()
  dateOfBirth?: string;
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: any) {
    return this.usersService.profile(req.user.id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch('me/edit')
  async patchMe(@Request() req: any, @Body() patchProfileDTO: PatchProfileDTO) {
    return this.usersService.updateUserProfile(req.user.id, patchProfileDTO);
  }
}
