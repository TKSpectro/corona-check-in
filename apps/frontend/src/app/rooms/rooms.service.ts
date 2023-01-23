import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerService } from '../shared/server.service';
import { PaginationResponse, Room } from '../shared/types';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private roomResponse!: PaginationResponse<Room>;

  constructor(private serverSrv: ServerService) {}

  getMetaData() {
    return this.roomResponse?._meta;
  }
  getRoomDetails(id: string) {
    return this.serverSrv.getRoom(id);
  }

  updateQrCode(room: Room) {
    return this.serverSrv.updateQrCode(room);
  }

  getRoomList(
    page = 0,
    take = 10,
    name?: string,
    faculty?: string,
    id?: string
  ) {
    if (
      !id &&
      !name &&
      !faculty &&
      page === this.roomResponse?._meta?.page &&
      this.roomResponse?.data?.length > 0
    ) {
      return of(this.roomResponse);
    }
    return this.serverSrv.getRooms(page, take, name, faculty).pipe(
      map((data) => {
        this.roomResponse = { ...data };
        return data;
      })
    );
  }
}
