import { Injectable } from '@angular/core';
import { ServerService } from '../shared/server.service';
import { Observable, Subject } from 'rxjs';
import { Meta, Room } from '../shared/types';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

interface RoomListResponse {
  data: Room[];
  _meta: Meta;
}

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private metaData!: RoomListResponse;
  roomList$: Observable<any> = this.getRoomListWithMetaData();

  constructor(private serverSrv: ServerService) {}

  getRoomListWithMetaData(
    page = 0,
    limit = 10,
    roomFilter?: string
  ): Observable<any> {
    if (
      this.metaData &&
      this.metaData.data &&
      this.metaData.data.length !== 0
    ) {
      return of(this.metaData);
    }
    return this.serverSrv.getRooms(page, limit, roomFilter).pipe(
      map((data) => {
        this.metaData = { ...data };
        return data;
      })
    );
  }
}
