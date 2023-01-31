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

  @Get('get-current-session')
  getCurrentSession(@Request() req) {
    return this.sessionsService.getCurrentSession(req.user);
  }

  @Get('mark-last-sessions-as-infected')
  markLastSessionsAsInfected(@Request() req) {
    return this.sessionsService.markLastSessionsAsInfected(req.user);
  }

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

  @Put()
  updateSession(@Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.updateSession(updateSessionDto);
  }

  @Delete(':id')
  removeSession(@Param('id') id: string) {
    return this.sessionsService.removeSession(id);
  }
}
