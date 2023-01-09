import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { lastValueFrom, Observable } from 'rxjs';
import { RoomDto } from './rooms.dto';
import { UpdateRoomDto } from './update-rooms.dto';
import { RoomEntity } from './room.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: RoomDto): Observable<RoomEntity> {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Get()
  async findAll(
    @Query('page') page = 0,
    @Query('limit') limit = 10,
    @Query('roomFilter') roomFilter = ''
  ) {
    const _meta = { limit: 10, page: 0, totalPages: 2, total: 10, count: 10 };
    const rooms = await lastValueFrom(
      this.roomsService.getRooms(page, limit, roomFilter)
    );
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
