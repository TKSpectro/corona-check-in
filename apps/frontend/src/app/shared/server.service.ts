import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../auth/user';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  constructor(private httpClient: HttpClient) {}

  getIncidenceData(): Observable<any> {
    return this.httpClient.get<any>('/api/incidence');
  }

  // cross domain problem
  login(user: User): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>('/api/auth/login', user);
  }

  me(): Observable<any> {
    return this.httpClient.get<any>('/api/me');
  }

  deleteUser(id: string): Observable<boolean> {
    return this.httpClient.delete<any>(`/api/users/${id}`);
  }
}
