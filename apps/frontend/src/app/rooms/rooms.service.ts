import { Injectable } from '@angular/core';
import { of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerService } from '../shared/server.service';
import { PaginationResponse, Room } from '../shared/types';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private roomResponse!: PaginationResponse<Room>;
  roomSubject = new Subject<Room>();

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
    id?: string,
    force = false
  ) {
    if (
      !id &&
      !name &&
      !faculty &&
      page === this.roomResponse?._meta?.page &&
      this.roomResponse?.data?.length > 0 &&
      !force
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

  createRoom(room: Room) {
    return this.serverSrv.createRoom(room).pipe(
      map((data) => {
        this.roomSubject.next(data);
        this.roomResponse.data.push(data);
        return data;
      })
    );
  }

  updateRoom(room: Room) {
    return this.serverSrv.updateRoom(room);
  }

  deleteRoom(id: string) {
    return this.serverSrv.deleteRoom(id);
  }
}
