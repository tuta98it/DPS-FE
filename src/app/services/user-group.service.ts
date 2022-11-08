import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import userGroups from '../../assets/demo/data/user-groups.json';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService extends BaseService {
  url = '/Group';
  getUserGroups() {
    return userGroups.data;
  }
}
