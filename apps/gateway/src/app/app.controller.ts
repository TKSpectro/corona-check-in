import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/items')
  getItems() {
    return this.appService.getItems();
  }

  @Get('/items/:id')
  getItem(@Param('id') id: number) {
    return this.appService.getItem(id);
  }

  @Post('/items')
  createItem(@Body() { name }: { name: string }) {
    return this.appService.createItem({ name });
  }
}
