import { Injectable } from '@angular/core';
import { ServerService } from '../shared/server.service';
import { UpdateUser } from '../shared/types';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private serverSrv: ServerService) {}

  getProfileData() {
    return this.serverSrv.me();
  }

  updateUser(id: string, data: UpdateUser) {
    return this.serverSrv.updateUser(id, data);
  }

  deleteUser(id: string) {
    return this.serverSrv.deleteUser(id);
  }
}
