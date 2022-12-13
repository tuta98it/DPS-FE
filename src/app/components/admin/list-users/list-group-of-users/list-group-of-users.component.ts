import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserGroupService } from 'src/app/services/user-group.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { Constants } from 'src/app/shared/constants/constants';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { Console } from 'console';

@Component({
    selector: 'list-group-of-users',
    templateUrl: './list-group-of-users.component.html',
    styleUrls: ['./list-group-of-users.component.scss'],
})
export class ListGroupOfUsersComponent implements OnInit {
    ACTIONS = Constants.ACTIONS;
    cols: any[] = [];
    listGroups: any = [];
    listGroupsOfUsers: any = [];
    loading = false;
    filteredGroups: any[] = [];
    selectedGroups :any[] = [];
    listGroupId: any[] =[] ;

    searchData = {
        skip: 0,
        take: 1000,
        keyword: '',
    };
    total = 0;

    _userId = '';
    @Input() set userId(value: string) {
        this._userId = value;
        if (value) {
            this.getListGroupOfUser();
        }
    }
    get userId() {
        return this._userId;
    }
    _visible = false;
    @Input() set visible(value: boolean) {
        this._visible = value;
        if(value){
            this.visibleChange.emit(value);
            this.getUserGroup();
        }
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
            { field: 'desc', header: 'Mô tả', width: '50%' },
        ];
    }

    ngOnInit(): void {}

    getListGroup() {
        return new Promise((resolve, rejects) => {
            this.loading = true;
            this.userGroupService
                .search(this.searchData)
                .subscribe({
                    next: (res) => {
                        if (res.isValid) {
                            this.listGroups = res.jsonData.data;
                            this.total = res.jsonData.total;
                        }
                        resolve(this.listGroups);
                    },
                })
                .add(() => {
                    this.loading = false;
                });
        });
    }

    getListGroupOfUser() {
        return new Promise((resolve, rejects) => {
            this.loading = true;
            this.userGroupService
                .getListGroupOfUser(this.userId)
                .subscribe({
                    next: (res) => {
                        if (res.isValid) {
                            let currentUserGroup = res.jsonData.map(
                                (t: any) => t.id
                            );
                            resolve(currentUserGroup);
                        }
                    },
                })
                .add(() => {
                    this.loading = false;
                });
        });
    }
    getUserGroup() {
      Promise.all([this.getListGroup(),this.getListGroupOfUser() ]).then(
          (values: any[]) => {
              this.selectedGroups = values[0].filter((t: any) =>
                  values[1].includes(t.id)
              );
          }
      );
    }
    saveGroupOfUser() {
        for(var i=0; i< this.selectedGroups.length; i++)  {
            this.listGroupId.push(this.selectedGroups[i].id)
        }
        this.userGroupService.UpdateGroupOfUser(this.userId ,this.listGroupId).subscribe({
            next:(res) => {
                if(res.isValid) {
                this.notification.success('Thêm Group thành công', '');
                this.getUserGroup();
                this.closeListGroup();
                this.listGroupId=[];
                }
            }
        })
    }
    closeListGroup(){
        this._visible= false;
        this.visibleChange.emit(false)
    }
}
