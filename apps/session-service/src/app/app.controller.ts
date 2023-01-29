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

  @MessagePattern({ role: 'sessions', cmd: 'health' })
  health() {
    return true;
  }

  @MessagePattern({ role: 'sessions', cmd: 'get-all' })
  getSessions({
    pageOptionsDto,
    user,
    infected,
    sessionBegin,
    sessionEnd,
  }: {
    pageOptionsDto: PageOptionsDto;
    user: RequestUser;
    infected?: string;
    sessionBegin?: Date;
    sessionEnd?: Date;
  }) {
    return this.appService.getSessions(
      pageOptionsDto,
      user,
      infected,
      sessionBegin,
      sessionEnd
    );
  }

  @MessagePattern({ role: 'session', cmd: 'get-by-id' })
  getSessionById({ id, user }: { id: string; user: RequestUser }) {
    return this.appService.getSessionById(id, user);
  }

  @MessagePattern({ role: 'session', cmd: 'get-current-session' })
  getCurrentSession({ user }: { user: RequestUser }) {
    return this.appService.getCurrentSession(user);
  }

  @MessagePattern({ role: 'session', cmd: 'create-session' })
  createSession(createSessionDto: SessionDto): Promise<SessionEntity> {
    return this.appService.createSession(createSessionDto);
  }

  @MessagePattern({ role: 'session', cmd: 'scan-code' })
  scanQrCode(createSessionDto: SessionDto): Promise<SessionEntity> {
    return this.appService.createSessionFromQrCode(createSessionDto);
  }

  @MessagePattern({ role: 'session', cmd: 'update-session' })
  updateSession(updateSessionDto: UpdateSessionDto): Promise<SessionEntity> {
    return this.appService.updateSession(updateSessionDto);
  }

  @MessagePattern({ role: 'session', cmd: 'delete-session' })
  deleteSession(id: string): Promise<boolean> {
    return this.appService.deleteSession(id);
  }
}
