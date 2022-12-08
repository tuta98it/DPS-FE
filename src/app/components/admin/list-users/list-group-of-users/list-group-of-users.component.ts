import { Component,Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserGroupService } from 'src/app/services/user-group.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'list-group-of-users',
  templateUrl: './list-group-of-users.component.html',
  styleUrls: ['./list-group-of-users.component.scss']
})
export class ListGroupOfUsersComponent implements OnInit {
    @Input() userId = '';
    loading= false;
    cols:any[] = [];
    filteredGroups: any[] = [];
    selectedGroup = INIT_AUTH_MODEL;
    groups: any = [];




  constructor(
    private userService: UserService,
    private notification: NotificationService,
    private userGroupService: UserGroupService
  ) {
    this.cols = [
        { field: 'name', header: 'Tên nhóm', width: '30%' },
        { field: 'desc', header: 'Mô tả', width: '50%' }
    ];
  }

  ngOnInit(): void {
    this.getListGroup();
  }

  getListGroup() {
    this.loading = true;
    this.userService.getUsers(this.userId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.groups = res.jsonData;
        }
      }
    }).add(() => {
      this.loading = false
    });
  }
//   addGroup() {
//     this.userGroupService.addUser(this.selectedGroup?.groupId ?? '', this.userId).subscribe({
//       next: (res) => {
//         if (res.isValid) {
//           this.notification.success('Thêm user thành công', '');
//           this. getListGroup();
//         }
//       }
//     });
//   }
  filterGroup(data:any) {
    let payload = {
        skip: 0,
        take: 10,
        keyword: data.query
      }
      this.userGroupService.search(payload).subscribe({
        next: (res) => {
          if (res.isValid) {
            this.filteredGroups = [];
            res.jsonData.forEach((u:any) => {
              this.filteredGroups.push({
                groupId: u.id,
                name: u.name,
                desc: u.desc,
                label: u.name + ' - ' + u.desc
              });
            });
          }
        }
      });
    }




}
