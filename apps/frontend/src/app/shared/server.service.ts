import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserSignup } from '../auth/user';
import {
  PaginationResponse,
  Room,
  ScanQrCodeBody,
  Session,
  UpdateUser,
} from './types';

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

  getCurrentSession(): Observable<any> {
    return this.httpClient.get<Session>('/api/sessions/get-current-session');
  }

  getSessions(
    page = 0,
    take = 10,
    infected?: boolean,
    sessionBegin?: string,
    sessionEnd?: string
  ): Observable<any> {
    return this.httpClient.get<any>('/api/sessions', {
      params: new HttpParams()
        .set('page', page.toString())
        .set('take', take.toString())
        .set('infected', infected ?? '')
        .set('sessionBegin', sessionBegin ? sessionBegin : '')
        .set('sessionEnd', sessionEnd ? sessionEnd : ''),
    });
  }

  updateSession(session: Session): Observable<Session> {
    return this.httpClient.put<Session>(`/api/sessions`, session);
  }

  deleteSession(id: string): Observable<null> {
    return this.httpClient.delete<null>(`/api/sessions/${id}`);
  }

  markLastSessionsAsInfected() {
    return this.httpClient.get<boolean>(
      '/api/sessions/mark-last-sessions-as-infected'
    );
  }

  // cross domain problem
  login(user: User): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>('/api/auth/login', user);
  }

  signup(user: UserSignup): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>('/api/auth/signup', user);
  }

  isAdmin() {
    return this.httpClient.get<{ isAdmin: boolean }>('/api/admin');
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
    name?: string,
    faculty?: string
  ) {
    return this.httpClient.get<PaginationResponse<Room>>('/api/rooms', {
      params: new HttpParams()
        .set('page', page.toString())
        .set('take', limit.toString())
        .set('name', name ? name : '')
        .set('faculty', faculty ? faculty : ''),
    });
  }

  getRoom(id: string) {
    return this.httpClient.get<Room>(`/api/rooms/${id}`);
  }

  createRoom(room: Room) {
    return this.httpClient.post<Room>(`/api/rooms`, room);
  }

  updateRoom(room: Room) {
    return this.httpClient.put<Room>(`/api/rooms`, room);
  }

  deleteRoom(id: string) {
    return this.httpClient.delete<Room>(`/api/rooms/${id}`);
  }

  updateQrCode(room: Room) {
    return this.httpClient.put<Room>(`/api/rooms/qr-code`, room);
  }

  scanQrCode(scanBody: ScanQrCodeBody) {
    return this.httpClient.post<Session>('/api/sessions/scan', scanBody);
  }
}
