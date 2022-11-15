import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService extends BaseService {
  url = '/Group';
  getUsersInGroup(groupId: string) {
    return this.get(`${this.url}/User/${groupId}`);
  }
  removeUser(userId: string, groupId: string) {
    let payload = { userId, groupId };
    return this.post(`${this.url}/RemoveUser`, payload);
  }
  addUser(userId: string, groupId: string) {
    let payload = { userId, groupId };
    return this.post(`${this.url}/AddUser`, payload);
  }
}
