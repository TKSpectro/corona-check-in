import {
  PageOptionsDto,
  RequestUser,
} from '@corona-check-in/micro-service-shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
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
  async getSessions({
    pageOptionsDto,
    user,
    infected,
    sessionBegin,
    sessionEnd,
    roomId,
    allInternalToken,
  }: {
    pageOptionsDto: PageOptionsDto;
    user: RequestUser;
    infected?: string;
    sessionBegin?: Date;
    sessionEnd?: Date;
    roomId?: string;
    allInternalToken?: string;
  }) {
    return this.appService.getSessions(
      pageOptionsDto,
      user,
      infected,
      sessionBegin,
      sessionEnd,
      roomId,
      allInternalToken
    );
  }

  @MessagePattern({ role: 'session', cmd: 'get-by-id' })
  async getSessionById({ id, user }: { id: string; user: RequestUser }) {
    return this.appService.getSessionById(id, user);
  }

  @MessagePattern({ role: 'session', cmd: 'get-current-session' })
  async getCurrentSession({ user }: { user: RequestUser }) {
    return this.appService.getCurrentSession(user);
  }

  @MessagePattern({ role: 'session', cmd: 'mark-last-sessions-as-infected' })
  async markLastSessionsAsInfected({
    user,
    userId,
  }: {
    user: RequestUser;
    userId?: string;
  }) {
    return this.appService.markLastSessionsAsInfected(user, userId);
  }

  @MessagePattern({ role: 'session', cmd: 'create' })
  async createSession(createSessionDto: SessionDto) {
    return this.appService.createSession(createSessionDto);
  }

  @MessagePattern({ role: 'session', cmd: 'scan-code' })
  async scanQrCode(createSessionDto: SessionDto) {
    return this.appService.createSessionFromQrCode(createSessionDto);
  }

  @MessagePattern({ role: 'session', cmd: 'update' })
  async updateSession(updateSessionDto: UpdateSessionDto) {
    return this.appService.updateSession(updateSessionDto);
  }

  @MessagePattern({ role: 'session', cmd: 'delete' })
  async deleteSession(id: string) {
    return this.appService.deleteSession(id);
  }

  @MessagePattern({ role: 'session', cmd: 'get-current-status' })
  async getCurrentStatus({ user }: { user: RequestUser }) {
    return this.appService.getCurrentStatus(user);
  }
}
