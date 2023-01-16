import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
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
import { firstValueFrom, Observable } from 'rxjs';
import { RoomEntity } from './room.entity';
import { RoomDto } from './rooms.dto';
import { RoomsService } from './rooms.service';
import { UpdateRoomDto } from './update-rooms.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('roomFilter') roomFilter = ''
  ) {
    return await firstValueFrom(
      this.roomsService.getRooms(pageOptionsDto, roomFilter)
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.getRoom(id);
  }

  @Post()
  create(@Body() createRoomDto: RoomDto): Observable<RoomEntity> {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Put()
  update(@Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(updateRoomDto);
  }

  @Put('/qr-code')
  updateQrCode(@Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.updateQrCode(updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.removeRoom(id);
  }
}
