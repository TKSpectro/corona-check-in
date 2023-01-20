import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UpdateSessionDto } from './sessions.dto';
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
        sessionBegin,
        sessionEnd
      )
    );
  }

  @Put('')
  update(@Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.updateSession(updateSessionDto);
  }
}
