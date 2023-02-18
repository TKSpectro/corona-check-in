import { Injectable } from '@angular/core';
import { ServerService } from '../shared/server.service';
import { User } from '../shared/types';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private serverSrv: ServerService) {}

  getUsers(page = 0, take = 10, search?: string) {
    return this.serverSrv.getUsers(page, take, search);
  }

  updateUser(id: string, user: User) {
    return this.serverSrv.updateUser(id, user);
  }

  deleteUser(id: string) {
    return this.serverSrv.deleteUser(id);
  }
}
