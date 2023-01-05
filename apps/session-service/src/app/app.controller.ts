import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ role: 'sessions', cmd: 'get-all' })
  getSessions({
    skip,
    limit,
    infected,
    sessionName,
  }: {
    skip: number;
    limit: number;
    infected?: boolean;
    sessionName?: string;
  }) {
    return this.appService.getSessions(skip, limit, infected, sessionName);
  }

  @MessagePattern({ role: 'sessions', cmd: 'get-by-id' })
  getSessionById({ id }: { id: string }) {
    return this.appService.getSessionById(id);
  }
}
