import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomEntity } from '../../../room-service/src/app/room.entity';
import { lastValueFrom, Observable } from 'rxjs';
import { RoomDto } from './rooms.dto';
import { UpdateRoomDto } from './update-rooms.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: RoomDto): Observable<RoomEntity> {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Get()
  async findAll(@Query('page') page = 0, @Query('limit') limit = 10) {
    console.log(page, limit);
    const _meta = { limit: 10, page: 0, totalPages: 2, total: 11, count: 10 };
    const rooms = await lastValueFrom(this.roomsService.getRooms(page, limit));
    return { rooms, _meta };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.getRoom(id);
  }

  @Put()
  update(@Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.removeRoom(id);
  }
}
