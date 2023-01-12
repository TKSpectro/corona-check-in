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
  _meta: any;

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
        const selectedRoom = this.roomsSrv.getRoom(this.id);
        if (selectedRoom) this.room = selectedRoom;
      })
    );

    this.subscription.push(
      this.roomsSrv.roomSubject.subscribe((room: Room) => {
        this.room = room;
      })
    );
    this.loadSessions();
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
            this._meta = data._meta;
          },
          error: (err) => console.error(err),
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
