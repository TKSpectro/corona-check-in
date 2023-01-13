import { Injectable } from '@angular/core';
import { ServerService } from '../shared/server.service';
import { Observable, of } from 'rxjs';
import { Meta, Room } from '../shared/types';
import { map } from 'rxjs/operators';

interface RoomListResponse {
  data: Room[];
  _meta: Meta;
}

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private metaData!: RoomListResponse;

  constructor(private serverSrv: ServerService) {}

  getMetaData() {
    return this.metaData?._meta;
  }
  getRoomDetails(id: string): Observable<any> {
    return this.serverSrv.getRoom(id);
  }
  getRoomList(
    page = 0,
    take = 10,
    roomFilter?: string,
    id?: string
  ): Observable<any> {
    if (
      !id &&
      !roomFilter &&
      page === this.metaData?._meta?.page &&
      take === this.metaData?._meta?.take &&
      this.metaData &&
      this.metaData.data &&
      this.metaData.data.length !== 0
    ) {
      return of(this.metaData);
    }
    return this.serverSrv.getRooms(page, take, roomFilter).pipe(
      map((data) => {
        this.metaData = { ...data };
        return data;
      })
    );
  }
}
