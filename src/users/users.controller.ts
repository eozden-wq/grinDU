import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Post,
  Delete,
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

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async editUserProfile(
    @Body() patchProfileDTO: PatchProfileDTO,
    @Request() request: any,
  ): Promise<any | null> {
    return this.usersService.updateUserProfile(
      request.user.id,
      patchProfileDTO,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any | null> {
    return this.usersService.userProfile({ id });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Delete('')
  async deleteUser(@Request() request: any): Promise<any | null> {
    return this.usersService.deleteUser({ id: request.user.id });
  }
}
