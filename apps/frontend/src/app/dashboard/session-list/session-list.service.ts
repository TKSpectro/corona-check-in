import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ServerService } from '../../shared/server.service';

@Injectable({
  providedIn: 'root',
})
export class SessionListService {
  sessionData!: any;
  submitSessionData = new Subject<any>();

  constructor(private serverSrv: ServerService) {}

  getSessions(page = 0, limit = 10, sessionName?: string) {
    this.serverSrv.getSessions(page, limit, sessionName).subscribe({
      next: (data) => {
        this.sessionData = data;
        this.submitSessionData.next(this.sessionData);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
}
