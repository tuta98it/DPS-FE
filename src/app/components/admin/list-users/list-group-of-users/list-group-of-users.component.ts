import { Component,Input,EventEmitter, Output, OnInit } from '@angular/core';
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
    ACTIONS = Constants.ACTIONS;
    cols:any[] = [];
    groups: any = [];
    isVisibleDeleteItemDialog = false;
    textConfirmDelete = '';
    deletedItem: any = {};
    loading = false;
    filteredGroups: any[] = [];
    selectedGroup = INIT_AUTH_MODEL;

    _userId = '';
    @Input() set userId(value: string) {
      this._userId = value;
      if (value) {
        this.getListGroup();
      }
    }
    get userId() {
      return this._userId;

    }

    _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
    this.selectedGroup = INIT_AUTH_MODEL;
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();



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
  }

  getListGroup() {
    this.loading = true;
    this.userGroupService.getListGroup(this.userId).subscribe({
      next: (res) => {
        console.log("listgroup",res.jsonData)
        if (res.isValid) {
          this.groups = res.jsonData;
        }
      }
    }).add(() => {
      this.loading = false
    });
  }
  addGroup() {
    console.log('userId', this._userId);
    this.userGroupService.addUser(this.userId,"" ).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Thêm Group thành công', '');
          this. getListGroup();
        }
      }
    });
  }
  onDeleteItem(item: any) {
    this.userGroupService.removeUser(this.deletedItem.id, this.userId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Cập nhật thành công', '');
          this.isVisibleDeleteItemDialog = false;
          this. getListGroup();
        }
      }
    });
  }

  removeGroup() {
    this.userGroupService.removeUser(this.deletedItem.id, this.userId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Cập nhật thành công', '');
          this.isVisibleDeleteItemDialog = false;
          this.getListGroup();
        }
      }
    });
  }

  filterGroup(data:any) {
    let payload = {
        skip: 0,
        take: 10,
        keyword: data.query
      }
      this.userGroupService.searchGroup(payload).subscribe({
        next: (res) => {
          console.log(res.jsonData.data);
          if (res.isValid) {
            this.filteredGroups = [];
            res.jsonData.data.forEach((u:any) => {
              this.filteredGroups.push({
                id: u.id,
                name: u.name,
                desc: u.desc,
                label: u.name + ' - ' + u.desc
              });
            });
            console.log('filter',this.filteredGroups );
          }
        }
      });
    }




}
