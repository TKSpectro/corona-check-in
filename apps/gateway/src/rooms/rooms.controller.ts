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
import { findAllQuery, RoomDto } from './rooms.dto';
import { RoomsService } from './rooms.service';
import { UpdateRoomDto } from './update-rooms.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() query: findAllQuery
  ) {
    return this.roomsService.getRooms(pageOptionsDto, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roomsService.getRoom(id);
  }

  @Post()
  async create(@Body() createRoomDto: RoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Put()
  async update(@Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(updateRoomDto);
  }

  @Put('qr-code')
  async updateQrCode(@Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.updateQrCode(updateRoomDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.roomsService.removeRoom(id);
  }
}
