import {
  PageOptionsDto,
  UserRole,
} from '@corona-check-in/micro-service-shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { findAllQueryDto, UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('')
  @Roles(UserRole.ADMIN)
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() query?: findAllQueryDto
  ) {
    return this.userService.find(pageOptionsDto, query);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() data: UpdateUserDto
  ) {
    if (req.user.sub !== id && req.user.role !== 'admin') {
      throw new HttpException({ message: 'Forbidden' }, 403);
    }

    return await this.userService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Request() req, @Param('id') id: string) {
    if (req.user.sub !== id && req.user.role !== 'admin') {
      throw new HttpException({ message: 'Forbidden' }, 403);
    }

    await this.userService.delete(id);

    return;
  }
}
