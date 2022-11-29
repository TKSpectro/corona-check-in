import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../auth/user';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  constructor(private httpClient: HttpClient) {}

  getIncidenceData(): Observable<any> {
    return this.httpClient.get<any>('/api/incidence');
  }

  getSessions(page = 0, limit = 10): Observable<any> {
    return this.httpClient.get('/api/sessions', {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString()),
    });
  }

  // cross domain problem
  login(user: User): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>('/api/auth/login', user);
  }
}
