import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('/:id')
  getSessionById(@Param('id') id: string) {
    return this.sessionsService.getSessionById(id);
  }

  @Get('')
  async getSessions(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('infected') infected?: boolean,
    @Query('sessionName') sessionName?: string,
    @Query('sessionBegin') sessionBegin?: Date,
    @Query('sessionEnd') sessionEnd?: Date
  ) {
    return await firstValueFrom(
      this.sessionsService.getSessions(
        pageOptionsDto,
        infected,
        sessionName,
        sessionBegin,
        sessionEnd
      )
    );
  }
}
