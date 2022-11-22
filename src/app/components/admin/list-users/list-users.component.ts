import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {
  searchData = {
    skip: 0,
    take: 20,
    keyword: ''
  }
  loading = false;
  total = 0;
  users: any = [];
  cols: any[] = [];
  selectedUser: any = {};
  
  constructor(
    private userService: UserService,
  ) { 
    this.cols = [
      { field: 'fullname', header: 'Họ và tên', width: '15rem' },
      { field: 'username', header: 'Tài khoản', width: '15rem' },
      { field: 'phoneNo', header: 'SĐT', width: '15rem' },
      { field: 'email', header: 'Email', width: '50rem' },
    ];
  }

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.loading = true;
    this.userService.getUsers(this.searchData).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.users = res.jsonData.data;
          this.users.forEach((u: any) => u.enable = !u.disable);
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
