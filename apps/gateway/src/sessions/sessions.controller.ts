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
  getSessionById(@Param('id') id: string) {
    return this.sessionsService.getSessionById(id);
  }

  @Get()
  async getSessions(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('infected') infected?: boolean,
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

  @Post()
  createSession(@Body() sessionDto: SessionDto, @Request() req) {
    return this.sessionsService.createSession({
      ...sessionDto,
      userId: req.user.sub,
    });
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
