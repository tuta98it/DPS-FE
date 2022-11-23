import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService extends BaseService {
  override url = '/Group';
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
  updateGroupRoles(groupId: string, roleIds: string[]) {
    return this.post(`${this.url}/Role/${groupId}`, { roleIds });
  }
}
