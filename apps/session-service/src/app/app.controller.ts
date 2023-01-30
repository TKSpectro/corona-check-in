import {
  PageOptionsDto,
  RequestUser,
} from '@corona-check-in/micro-service-shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
import { SessionEntity } from './session.entity';
import { SessionDto } from './sessions.dto';
import { UpdateSessionDto } from './update-sessions.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ role: 'session', cmd: 'health' })
  health() {
    return true;
  }

  @MessagePattern({ role: 'session', cmd: 'get-all' })
  getSessions({
    pageOptionsDto,
    user,
    infected,
    sessionBegin,
    sessionEnd,
    roomId,
  }: {
    pageOptionsDto: PageOptionsDto;
    user: RequestUser;
    infected?: string;
    sessionBegin?: Date;
    sessionEnd?: Date;
    roomId?: string;
  }) {
    return this.appService.getSessions(
      pageOptionsDto,
      user,
      infected,
      sessionBegin,
      sessionEnd,
      roomId
    );
  }

  @MessagePattern({ role: 'session', cmd: 'get-by-id' })
  getSessionById({ id, user }: { id: string; user: RequestUser }) {
    return this.appService.getSessionById(id, user);
  }

  @MessagePattern({ role: 'session', cmd: 'create' })
  createSession(createSessionDto: SessionDto): Promise<SessionEntity> {
    return this.appService.createSession(createSessionDto);
  }

  @MessagePattern({ role: 'session', cmd: 'scan-code' })
  scanQrCode(createSessionDto: SessionDto): Promise<SessionEntity> {
    return this.appService.createSessionFromQrCode(createSessionDto);
  }

  @MessagePattern({ role: 'session', cmd: 'update' })
  updateSession(updateSessionDto: UpdateSessionDto): Promise<SessionEntity> {
    return this.appService.updateSession(updateSessionDto);
  }

  @MessagePattern({ role: 'session', cmd: 'delete' })
  deleteSession(id: string): Promise<boolean> {
    return this.appService.deleteSession(id);
  }
}
