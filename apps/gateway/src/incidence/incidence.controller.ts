import { Controller, Get, Param, Request } from '@nestjs/common';
import { IncidenceService } from './incidence.service';

@Controller()
export class IncidenceController {
  constructor(private readonly incidenceService: IncidenceService) {}
  @Get('/incidences/7-day-average')
  get7DayAverage(@Request() req) {
    return this.incidenceService.get7DayAverage(req.user);
  }

  @Get('/incidences/7-day-average-for-room/:roomId')
  get7DayAveragePerRoom(@Request() req, @Param('roomId') roomId: string) {
    return this.incidenceService.get7DayAverageForRoom(req.user, roomId);
  }
}
