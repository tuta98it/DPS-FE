import { Component, Input, OnInit } from '@angular/core';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { UserGroupService } from 'src/app/services/user-group.service';
import { UserService } from 'src/app/services/user.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'list-users-in-group',
  templateUrl: './list-users-in-group.component.html',
  styleUrls: ['./list-users-in-group.component.scss']
})
export class ListUsersInGroupComponent implements OnInit {
  ACTIONS = Constants.ACTIONS;
  cols: any[] = [];
  users: any = [];
  isVisibleDeleteItemDialog = false;
  textConfirmDelete = '';
  deletedItem: any = {};
  loading = false;
  @Input() groupId = '';
  selectedUser = INIT_AUTH_MODEL;
  filteredUsers: any[] = [];
  constructor(
    private userGroupService: UserGroupService,
    private userService: UserService,
    private notification: NotificationService
  ) {
    this.cols = [
      { field: 'username', header: 'Tài khoản', width: '30%' },
      { field: 'fullname', header: 'Tên', width: '50%' },
    ];
  }

  ngOnInit(): void {
    this.getUsersInGroup();
  }

  getUsersInGroup() {
    this.loading = true;
    this.userGroupService.getUsersInGroup(this.groupId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.users = res.jsonData;
        }
      }
    }).add(() => {
      this.loading = false
    });
  }
  onDeleteItem(item: any) {
    this.textConfirmDelete = `Xác nhận xóa user <b>${item.fullname}</b> khỏi nhóm?`
    this.deletedItem = item;
    this.isVisibleDeleteItemDialog = true;
  }
  addUser() {
    this.userGroupService.addUser(this.selectedUser?.userId ?? '', this.groupId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Thêm user thành công', '');
          this.getUsersInGroup();
        }
      }
    });
  }
  removeUser() {
    this.userGroupService.removeUser(this.deletedItem.id, this.groupId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Cập nhật thành công', '');
          this.isVisibleDeleteItemDialog = false;
          this.getUsersInGroup();
        }
      }
    });
  }
  filterUser(data: any) {
    let payload = {
      skip: 0,
      take: 10,
      keyword: data.query
    }
    this.userService.search(payload).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.filteredUsers = [];
          res.jsonData.forEach((u:any) => {
            this.filteredUsers.push({
              userId: u.id,
              userName: u.username,
              fullName: u.fullname,
              label: u.fullname + ' - ' + u.username
            });
          });
        }
      }
    });
  } 
}
