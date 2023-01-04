import { Controller, Delete, Get, Param } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // @Post()
  // create(@Body() createRoomDto: CreateRoomDto) {
  //   return this.roomsService.create(createRoomDto);
  // }

  @Get()
  findAll() {
    return this.roomsService.getRooms();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.getRoom(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
  //   return this.roomsService.update(+id, updateRoomDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
