import {
  PageOptionsDto,
  UserRole,
} from '@corona-check-in/micro-service-shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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

  @Get('get-current-session')
  getCurrentSession(@Request() req) {
    return this.sessionsService.getCurrentSession(req.user);
  }

  @Get('mark-last-sessions-as-infected')
  markLastSessionsAsInfected(@Request() req) {
    return this.sessionsService.markLastSessionsAsInfected(req.user);
  }

  @Get()
  @HttpCode(200)
  async getSessions(
    @Request() req,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('infected') infected?: boolean,
    @Query('sessionBegin') sessionBegin?: Date,
    @Query('sessionEnd') sessionEnd?: Date
  ) {
    return this.sessionsService.getSessions(
      pageOptionsDto,
      req.user,
      infected,
      sessionBegin,
      sessionEnd
    );
  }

  @Get(':id')
  @HttpCode(200)
  getSessionById(@Request() req, @Param('id') id: string) {
    return this.sessionsService.getSessionById(id, req.user);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  @HttpCode(201)
  async createSession(@Body() sessionDto: SessionDto, @Request() req) {
    return this.sessionsService.createSession({
      ...sessionDto,
      userId: req.user.sub,
    });
  }

  @Post('scan')
  @HttpCode(201)
  async scanQrCode(@Body() sessionDto: SessionDto, @Request() req) {
    return this.sessionsService.scanQrCode({
      ...sessionDto,
      userId: req.user.sub,
    });
  }


  @Put()
  @HttpCode(200)
  async updateSession(@Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.updateSession(updateSessionDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async removeSession(@Param('id') id: string) {
    return this.sessionsService.removeSession(id);
  }
}
