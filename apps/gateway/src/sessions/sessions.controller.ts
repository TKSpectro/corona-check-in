import { Controller, Get, Param } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('')
  getSessions() {
    return this.sessionsService.getSessions();
  }

  @Get('/:id')
  getSessionById(@Param('id') id: string) {
    return this.sessionsService.getSessionById(id);
  }
}
