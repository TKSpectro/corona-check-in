import { Injectable } from '@angular/core';
import { ServerService } from '../shared/server.service';
import { Observable, Subject } from 'rxjs';
import { Room } from '../shared/types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private rooms: Room[] = [];
  roomList$: Observable<any> = this.getRoomListWithMetaData();
  roomSubject = new Subject<Room>();
  roomObs$: Observable<Room> = this.roomSubject.asObservable();
  roomTest: Room = {
    createdDate: '2023-01-11T17:12:36.804Z',
    createdQrCode: '2023-01-04T15:07:52.683Z',
    faculty: 'Angewandte Informatik',
    id: '54f404df-724b-4afb-b29f-8c4659855e8d',
    maxDuration: 60,
    maxParticipants: 10,
    name: 'room-session-3',
    qrCode: '1234',
    updatedDate: '2023-01-11T17:12:36.804Z',
  };

  constructor(private serverSrv: ServerService) {}

  getRoom(id: string): Room | undefined {
    if (this.rooms.length !== 0) {
      const selectedRoom = this.rooms.find(
        (selectedRoom) => selectedRoom.id === id
      );
      if (selectedRoom) {
        return selectedRoom;
      }
    }
    this.getRoomList(id);
    return undefined;
  }

  getRoomList(id: string) {
    this.serverSrv.getRooms().subscribe((data) => {
      this.rooms = data.data;
      const selectedRoom = this.rooms.find(
        (selectedRoom) => selectedRoom.id === id
      );
      if (selectedRoom) {
        this.roomSubject.next(selectedRoom);
      }
    });
  }

  getRoomListWithMetaData(
    page = 0,
    limit = 10,
    roomFilter?: string
  ): Observable<any> {
    return this.serverSrv.getRooms(page, limit, roomFilter).pipe(
      map((data) => {
        this.rooms = data.data;
        return data;
      })
    );
  }
}
