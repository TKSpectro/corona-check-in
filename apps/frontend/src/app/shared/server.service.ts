import { HttpClient } from '@angular/common/http';
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
}
