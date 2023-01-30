import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  @HttpCode(200)
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() query: findAllQuery
  ) {
    return this.roomsService.getRooms(pageOptionsDto, query);
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    return this.roomsService.getRoom(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createRoomDto: RoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Put()
  @HttpCode(200)
  async update(@Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(updateRoomDto);
  }

  @Put('qr-code')
  @HttpCode(200)
  async updateQrCode(@Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.updateQrCode(updateRoomDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return this.roomsService.removeRoom(id);
  }
}
