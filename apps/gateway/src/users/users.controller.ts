import {
  Controller,
  Delete,
  HttpCode,
  HttpException,
  Param,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

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
