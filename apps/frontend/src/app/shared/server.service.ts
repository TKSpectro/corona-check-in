import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserSignup } from '../auth/user';
import { UpdateUser } from './types';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  constructor(private httpClient: HttpClient) {}

  getIncidenceData(): Observable<any> {
    return this.httpClient.get<any>('/api/incidence');
  }

  getSessionById(id: string): Observable<any> {
    return this.httpClient.get<any>('/api/sessions/' + id);
  }

  getSessions(
    page = 0,
    take = 10,
    infected?: boolean,
    sessionBegin?: string,
    sessionEnd?: string,
    sessionName?: string
  ): Observable<any> {
    return this.httpClient.get('/api/sessions', {
      params: new HttpParams()
        .set('page', page.toString())
        .set('take', take.toString())
        .set('infected', infected ?? '')
        .set('sessionBegin', sessionBegin ? sessionBegin : '')
        .set('sessionEnd', sessionEnd ? sessionEnd : '')
        .set('sessionName', sessionName ? sessionName : ''),
    });
  }

  // cross domain problem
  login(user: User): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>('/api/auth/login', user);
  }

  signup(user: UserSignup): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>('/api/auth/signup', user);
  }

  me(): Observable<User> {
    return this.httpClient.get<User>('/api/me');
  }

  updateUser(id: string, user: UpdateUser): Observable<User> {
    return this.httpClient.put<User>(`/api/users/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.httpClient.delete<any>(`/api/users/${id}`);
  }

  getRooms(
    page: number = 0,
    limit: number = 10,
    roomFilter?: string
  ): Observable<any> {
    return this.httpClient.get('/api/rooms', {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
        .set('roomFilter', roomFilter ? roomFilter : ''),
    });
  }
}
