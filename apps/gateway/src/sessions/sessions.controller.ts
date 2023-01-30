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
import { Roles } from '../auth/decorators/roles.decorator';
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
    this.sessionsService.getSessions(
      pageOptionsDto,
      req.user,
      infected,
      sessionBegin,
      sessionEnd
    );
  }

  @Roles(UserRole.ADMIN)
  @Post()
  async createSession(@Body() sessionDto: SessionDto, @Request() req) {
    return this.sessionsService.createSession({
      ...sessionDto,
      userId: req.user.sub,
    });
  }

  @Post('scan')
  async scanQrCode(@Body() sessionDto: SessionDto, @Request() req) {
    return this.sessionsService.scanQrCode({
      ...sessionDto,
      userId: req.user.sub,
    });
  }

  @Post('markLastSessionsAsInfected')
  async markLastSessionsAsInfected(@Body() userId: string) {
    return this.sessionsService.markLastSessionsAsInfected(userId);
  }

  @Put()
  async updateSession(@Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.updateSession(updateSessionDto);
  }

  @Delete(':id')
  async removeSession(@Param('id') id: string) {
    return this.sessionsService.removeSession(id);
  }
}
