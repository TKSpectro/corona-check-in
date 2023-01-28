import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { SessionDto } from './sessions.dto';
import { SessionsService } from './sessions.service';
import { UpdateSessionDto } from './update-sessions.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get(':id')
  getSessionById(@Request() req, @Param('id') id: string) {
    return this.sessionsService.getSessionById(id, req.user);
  }

  @Get()
  async getSessions(
    @Request() req,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('infected') infected?: boolean,
    @Query('sessionBegin') sessionBegin?: Date,
    @Query('sessionEnd') sessionEnd?: Date
  ) {
    return await firstValueFrom(
      this.sessionsService.getSessions(
        pageOptionsDto,
        req.user,
        infected,
        sessionBegin,
        sessionEnd
      )
    );
  }

  @Post()
  createSession(@Body() sessionDto: SessionDto, @Request() req) {
    return this.sessionsService.createSession({
      ...sessionDto,
      userId: req.user.sub,
    });
  }

  @Post('markLastSessionsAsInfected')
  markLastSessionsAsInfected(@Body() userId: string) {
    return this.sessionsService.markLastSessionsAsInfected(userId);
  }

  @Put()
  updateSession(@Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.updateSession(updateSessionDto);
  }

  @Delete(':id')
  removeSession(@Param('id') id: string) {
    return this.sessionsService.removeSession(id);
  }
}
