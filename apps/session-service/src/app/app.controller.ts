import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ role: 'sessions', cmd: 'get-all' })
  getSessions({
    pageOptionsDto,
    infected,
    sessionName,
    sessionBegin,
    sessionEnd,
  }: {
    pageOptionsDto: PageOptionsDto;
    infected?: string;
    sessionName?: string;
    sessionBegin?: Date;
    sessionEnd?: Date;
  }) {
    return this.appService.getSessions(
      pageOptionsDto,
      infected,
      sessionName,
      sessionBegin,
      sessionEnd
    );
  }

  @MessagePattern({ role: 'sessions', cmd: 'get-by-id' })
  getSessionById({ id }: { id: string }) {
    return this.appService.getSessionById(id);
  }
}
