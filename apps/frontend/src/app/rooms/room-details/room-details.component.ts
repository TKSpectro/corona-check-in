import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AdminService } from '../../auth/admin/admin.service';
import { IncidenceService } from '../../libs/graphs/incidence/incidence.service';
import { SessionListService } from '../../sessions/session-list.service';
import { IncidenceResult, Room } from '../../shared/types';
import { RoomsService } from '../rooms.service';

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
  incidenceChartData: IncidenceResult[] = [];
  qrCode = '';

  noIncidencesFound = false;

  constructor(
    private t: TranslateService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private sessionListService: SessionListService,
    private roomsSrv: RoomsService,
    private media: MediaMatcher,
    public adminSrv: AdminService,
    private incidenceService: IncidenceService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
  }

  ngOnInit(): void {
    this.subscription.push(
      this.route.paramMap.subscribe((params) => {
        this.id = params.get('id') || '';

        this.subscription.push(
          this.incidenceService.getIncidenceData(this.id).subscribe({
            next: (data) => {
              this.incidenceChartData = data;

              this.noIncidencesFound =
                this.incidenceChartData[0]?.series?.length === 0;
            },
            error: (error) => {
              this.snackBar.open(
                this.t.instant('INCIDENCE_CHART.LOAD_INCIDENCE_ERROR') +
                  '\n' +
                  error.error.message,
                undefined,
                {
                  panelClass: 'snackbar-error',
                }
              );
            },
          })
        );
      })
    );

    this.init();
    this.loadSessions();
  }

  init() {
    const _meta = this.roomsSrv.getMetaData();
    if (!_meta) {
      this.subscription.push(
        this.roomsSrv.getRoomDetails(this.id).subscribe({
          next: (data) => {
            this.room = data;
            this.qrCode = JSON.stringify({
              roomId: this.room.id,
              createdQrCode: this.room.createdQrCode,
            });
          },
          error: (error) => {
            this.snackBar.open(
              this.t.instant('ROOMS.LOAD_ROOM_DETAILS_ERROR') +
                '\n' +
                error.error.message,
              undefined,
              {
                panelClass: 'snackbar-error',
              }
            );
          },
        })
      );
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
              roomId: this.room.id,
              createdQrCode: this.room.createdQrCode,
            });
          }
        },
        error: (error) => {
          this.snackBar.open(
            this.t.instant('ROOMS.LOAD_ROOM_LIST_ERROR') +
              '\n' +
              error.error.message,
            undefined,
            {
              panelClass: 'snackbar-error',
            }
          );
        },
      })
    );
  }

  loadSessions() {
    this.subscription.push(
      this.sessionListService
        .getSessions(0, 5, false, undefined, undefined, this.id)
        .pipe(
          mergeMap((data) => {
            this.sessionList = data.data;
            return this.sessionListService.getSessions(
              0,
              5,
              true,
              undefined,
              undefined,
              this.id
            );
          })
        )
        .subscribe({
          next: (data) => {
            this.infectedSessionList = data.data;
          },
          error: (error) => {
            this.snackBar.open(
              this.t.instant('ROOMS.LOAD_SESSIONS_ERROR') +
                '\n' +
                error.error.message,
              undefined,
              {
                panelClass: 'snackbar-error',
              }
            );
          },
        })
    );
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

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
