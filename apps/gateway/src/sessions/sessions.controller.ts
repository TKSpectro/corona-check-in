import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { lastValueFrom } from 'rxjs';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('/:id')
  getSessionById(@Param('id') id: string) {
    return this.sessionsService.getSessionById(id);
  }

  @Get('')
  async getSessions(
    @Query('page') page = 0,
    @Query('limit') limit = 10,
    @Query('infected') infected,
    @Query('sessionName') sessionName
  ): Promise<any> {
    limit = limit > 100 ? 100 : limit;
    const sessions = await lastValueFrom(
      this.sessionsService.getSessions(page, limit, infected, sessionName)
    );
    const _meta = { limit: 10, page: 0, totalPages: 2, total: 11, count: 10 };

    return { sessions: sessions, _meta: _meta };
  }
}
