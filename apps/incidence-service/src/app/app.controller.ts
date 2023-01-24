import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ role: 'incidence', cmd: 'health' })
  health() {
    return true;
  }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @MessagePattern({ role: 'incidence', cmd: 'get' })
  getIncidence() {
    return this.appService.getIncidence();
  }
}
