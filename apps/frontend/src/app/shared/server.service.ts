import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserSignup } from '../auth/user';
import {
  IncidenceResult,
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

  getIncidenceData(id = '') {
    return this.httpClient.get<IncidenceResult[]>(
      environment.backendUrl + '/incidences/7-day-average/' + id
    );
  }

  getSessionById(id: string): Observable<any> {
    return this.httpClient.get<any>(environment.backendUrl + '/sessions/' + id);
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
    return this.httpClient.get<any>(environment.backendUrl + '/sessions', {
      params: new HttpParams()
        .set('page', page.toString())
        .set('take', take.toString())
        .set('infected', infected ?? '')
        .set('sessionBegin', sessionBegin ? sessionBegin : '')
        .set('sessionEnd', sessionEnd ? sessionEnd : ''),
    });
  }

  updateSession(session: Session): Observable<Session> {
    return this.httpClient.put<Session>(
      `${environment.backendUrl}/sessions`,
      session
    );
  }

  deleteSession(id: string): Observable<null> {
    return this.httpClient.delete<null>(
      `${environment.backendUrl}/sessions/${id}`
    );
  }

  markLastSessionsAsInfected() {
    return this.httpClient.get<boolean>(
      environment.backendUrl + '/sessions/mark-last-sessions-as-infected'
    );
  }

  // cross domain problem
  login(user: User): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>(
      environment.backendUrl + '/auth/login',
      user
    );
  }

  signup(user: UserSignup): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>(
      environment.backendUrl + '/auth/signup',
      user
    );
  }

  isAdmin() {
    return this.httpClient.get<{ isAdmin: boolean }>(
      environment.backendUrl + '/admin'
    );
  }

  me(): Observable<User> {
    return this.httpClient.get<User>(environment.backendUrl + '/me');
  }

  updateUser(id: string, user: UpdateUser): Observable<User> {
    return this.httpClient.put<User>(
      `${environment.backendUrl}/users/${id}`,
      user
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.backendUrl}/users/${id}`);
  }

  getRooms(
    page: number = 0,
    limit: number = 10,
    name?: string,
    faculty?: string
  ) {
    return this.httpClient.get<PaginationResponse<Room>>(
      environment.backendUrl + '/rooms',
      {
        params: new HttpParams()
          .set('page', page.toString())
          .set('take', limit.toString())
          .set('name', name ? name : '')
          .set('faculty', faculty ? faculty : ''),
      }
    );
  }

  getRoom(id: string) {
    return this.httpClient.get<Room>(`${environment.backendUrl}/rooms/${id}`);
  }

  createRoom(room: Room) {
    return this.httpClient.post<Room>(`${environment.backendUrl}/rooms`, room);
  }

  updateRoom(room: Room) {
    return this.httpClient.put<Room>(`${environment.backendUrl}/rooms`, room);
  }

  deleteRoom(id: string) {
    return this.httpClient.delete<Room>(
      `${environment.backendUrl}/rooms/${id}`
    );
  }

  updateQrCode(room: Room) {
    return this.httpClient.put<Room>(
      `${environment.backendUrl}/rooms/qr-code`,
      room
    );
  }

  scanQrCode(scanBody: ScanQrCodeBody) {
    return this.httpClient.post<Session>(
      environment.backendUrl + '/sessions/scan',
      scanBody
    );
  }
}
