import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { SessionListService } from '../../sessions/session-list.service';
import { mergeMap } from 'rxjs/operators';
import { RoomsService } from '../rooms.service';
import { Room } from '../../shared/types';

@Component({
  selector: 'ccn-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss'],
})
export class RoomDetailsComponent implements OnInit, OnDestroy {
  id = '';
  room!: Room;
  mobileQuery: MediaQueryList;
  subscription: Subscription[] = [];
  sessionList = [];
  infectedSessionList = [];
  roomList: Room[] = [];
  qrCode = '';

  constructor(
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private sessionListService: SessionListService,
    private roomsSrv: RoomsService,
    private media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
  }

  ngOnInit(): void {
    this.subscription.push(
      this.route.paramMap.subscribe((params) => {
        this.id = params.has('id') ? params.get('id')! : '';
      })
    );

    this.init();
    this.loadSessions();
  }

  init() {
    const _meta = this.roomsSrv.getMetaData();
    if (!_meta) {
      this.roomsSrv.getRoomDetails(this.id).subscribe({
        next: (data) => {
          this.room = data;
          this.qrCode = JSON.stringify({
            id: this.room.id,
            name: this.room.createdQrCode,
          });
        },
        error: (err) => console.error(err),
      });
      return;
    }
    this.subscription.push(
      this.roomsSrv.getRoomList(_meta.page, _meta.take).subscribe({
        next: (res) => {
          this.roomList = res.data;
          const selectedRoom = this.roomList.find(
            (selectedRoom) => selectedRoom.id === this.id
          );
          if (selectedRoom) {
            this.room = selectedRoom;
            this.qrCode = JSON.stringify({
              id: this.room.id,
              name: this.room.createdQrCode,
            });
          }
        },
        error: (err) => console.error(err),
      })
    );
  }

  loadSessions() {
    this.subscription.push(
      this.sessionListService
        .getSessions(0, 5)
        .pipe(
          mergeMap((data) => {
            this.sessionList = data.data;
            return this.sessionListService.getSessions(0, 5, true);
          })
        )
        .subscribe({
          next: (data) => {
            this.infectedSessionList = data.data;
          },
          error: (err) => console.error(err),
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  renewCode() {
    const newDate = new Date();
    this.qrCode = JSON.stringify({
      id: this.room.id,
      name: newDate,
    });
    this.room.createdQrCode = newDate;
    this.roomsSrv.updateQrCode(this.room).subscribe((data) => {
      // TODO: show success message
      console.log(data);
    });
  }
}
