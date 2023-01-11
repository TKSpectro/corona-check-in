import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { RoomsService } from '../rooms.service';
import { Subscription } from 'rxjs';
import { Room } from '../../shared/types';
import { SessionListService } from '../../dashboard/session-list/session-list.service';

@Component({
  selector: 'ccn-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss'],
})
export class RoomDetailsComponent implements OnInit {
  id = '';
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;
  isExpanded!: boolean;
  subscription: Subscription[] = [];
  sessionList = [];
  _meta: any;

  constructor(
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private sessionListService: SessionListService,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener(
      'change',
      (event) => (this.isExpanded = !event.matches)
    );
  }

  ngOnInit(): void {
    this.subscription.push(
      this.route.paramMap.subscribe((params) => {
        this.id = params.has('id') ? params.get('id')! : '';
      })
    );
    this.loadSessions();
  }

  loadSessions() {
    this.subscription.push(
      this.sessionListService.getSessions(0, 5).subscribe({
        next: (data) => {
          console.log(data);
          this.sessionList = data.rooms;
          this._meta = data._meta;
        },
        error: (err) => console.error(err),
      })
    );
  }
}
