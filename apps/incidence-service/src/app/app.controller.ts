import { RequestUser } from '@corona-check-in/micro-service-shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ role: 'incidence', cmd: 'health' })
  health() {
    return true;
  }

  // @MessagePattern({ role: 'incidence', cmd: 'get' })
  // getIncidence() {
  //   return this.appService.getIncidence();
  // }

  @MessagePattern({ role: 'incidence', cmd: 'get-7-day-average' })
  get7DayAverage({ user }: { user: RequestUser }) {
    return this.appService.get7DayAverage({ user });
  }

  @MessagePattern({ role: 'incidence', cmd: 'get-7-day-average-for-room' })
  get7DayAverageForRoom({
    user,
    roomId,
  }: {
    user: RequestUser;
    roomId: string;
  }) {
    return this.appService.get7DayAverage({ user, roomId });
  }
}
