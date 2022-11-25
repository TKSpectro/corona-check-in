import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ role: 'sessions', cmd: 'get-all' })
  getSessions() {
    return this.appService.getSessions();
  }

  @MessagePattern({ role: 'sessions', cmd: 'get-by-id' })
  getSessionById({ id }: { id: string }) {
    return this.appService.getSessionById(id);
  }
}
