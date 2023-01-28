import {
  PageOptionsDto,
  UserRole,
} from '@corona-check-in/micro-service-shared';
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
import { Roles } from '../auth/decorators/roles.decorator';

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

  @Roles(UserRole.ADMIN)
  @Post()
  createSession(@Body() sessionDto: SessionDto, @Request() req) {
    return this.sessionsService.createSession({
      ...sessionDto,
      userId: req.user.sub,
    });
  }

  @Post('scan')
  scanQrCode(@Body() sessionDto: SessionDto, @Request() req) {
    return this.sessionsService.scanQrCode({
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
