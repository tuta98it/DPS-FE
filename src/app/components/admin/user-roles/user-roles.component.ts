import { Component, OnInit } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { Roles } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {
  searchData = {
    skip: 0,
    take: 20,
    keyword: ''
  }
  loading = false;
  total = 0;
  userRoles: any = [];
  roles: any = [];
  
  constructor(
    private userService: UserService,
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
            this.roles = res.jsonData.map((r: any) => r.name);
            resolve(true);
          }
        }
      });
    })
    
  }

  search() {
    this.loading = true;
    this.userService.getUserRoles(this.searchData).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.userRoles = res.jsonData.data;
          this.total = res.jsonData.total;
        }
      }
    }).add(() => {
      this.loading = false
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
