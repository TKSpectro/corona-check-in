import { Injectable } from '@angular/core';
import { ServerService } from '../shared/server.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  roomList$: Observable<any> = this.getRooms();

  constructor(private serverSrv: ServerService) {}

  getRooms(page = 0, limit = 10, roomFilter?: string): Observable<any> {
    return this.serverSrv.getRooms(page, limit, roomFilter);
  }
}
