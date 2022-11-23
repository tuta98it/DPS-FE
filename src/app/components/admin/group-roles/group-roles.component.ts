import { Component, OnInit } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { UserGroupService } from 'src/app/services/user-group.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-group-roles',
  templateUrl: './group-roles.component.html',
  styleUrls: ['./group-roles.component.scss']
})
export class GroupRolesComponent implements OnInit {
  searchData = {
    skip: 0,
    take: 20,
    keyword: ''
  }
  loading = false;
  total = 0;
  groups: any = [];
  roles: any = [];

  constructor(
    private groupService: UserGroupService,
    private notification: NotificationService,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.getRoles().then(r => this.search());
  }

  getRoles() {
    return new Promise((resolve, reject) => {
      this.roleService.getAll().subscribe({
        next: (res) => {
          if (res.isValid) {
            this.roles = res.jsonData;
            resolve(true);
          }
        }
      });
    });
  }

  search() {
    this.loading = true;
    this.groupService.search(this.searchData).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.groups = res.jsonData.data;
          this.groups.forEach((g:any) => {
            g.checkedRoles = [];
            this.roles.forEach((r:any) => {
              g.checkedRoles.push(g.roles.includes(r.name));
            });
          });
          this.total = res.jsonData.total;
        }
      }
    }).add(() => {
      this.loading = false
    });
  }

  updateGroupRoles(group: any) {
    let roleIds = [];
    for (let i=0; i<this.roles.length; ++i) {
      if (group.checkedRoles[i]) {
        roleIds.push(this.roles[i].id);
      }
    }
    this.groupService.updateGroupRoles(group.id, roleIds).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Cập nhật thành công');
        }
      }
    });
  }

  resetSearch() {
    this.searchData = {
      skip: 0,
      take: 20,
      keyword: ''
    };
    this.search();
  }

  onPageChange(data: any) {
    this.searchData.skip = data.first;
    this.searchData.take = data.rows;
    this.search();
  }
}
