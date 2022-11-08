import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { UserGroupService } from 'src/app/services/user-group.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss']
})
export class UserGroupsComponent implements OnInit {
  isVisibleUserGroupDialog = false;
  deleteItemDialog = false;
  userGroups: any = [];
  cols: any[] = [];
  selectedUserGroup = {};
  userGroupDialogHeader = '';
  isEditUserGroup = false;
  userGroupForm: FormGroup;
  deletedItem: any = {};
  searchData = {
    skip: 0,
    take: 20,
    keyword: ''
  }
  total = 0;
  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private userGroupService: UserGroupService
  ) {
    this.userGroupForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      desc: [null],
    });
  }

  ngOnInit() {
    // this.userGroupService.getUserGroups().then((data: any) => this.userGroups = data);
    // this.userGroups = this.userGroupService.getUserGroups();
    this.cols = [
      { field: 'name', header: 'Tên nhóm', width: '30rem' },
      { field: 'desc', header: 'Mô tả', width: '80rem' }
    ];
    this.search();
  }

  search() {
    this.userGroupService.search(this.userGroupService.url+ '/Search', this.searchData).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.userGroups = res.jsonData.data;
          console.log("search", this.userGroups)
          this.total = res.jsonData.total;
        }
      }
    });
  }

  openNew() {
    this.userGroupForm.patchValue({
      id: 0,
      name: '',
      desc: ''
    });
    this.isVisibleUserGroupDialog = true;
    this.isEditUserGroup = false;
    this.userGroupDialogHeader = 'Thêm mới group';
  }

  editItem(item: any) {
    this.userGroupForm.patchValue({
      id: item.groupId,
      name: item.name,
      desc: item.desc
    });
    this.isVisibleUserGroupDialog = true;
    this.isEditUserGroup = false;
    this.userGroupDialogHeader = 'Sửa thông tin group';
  }

  deleteItem(item: any) {
    this.deletedItem = item;
    this.deleteItemDialog = true;
  }

  changePage(data: any) {
    console.log("changePage", data);
  }

  confirmDelete() {
    // this.deleteItemDialog = false;
    // this.items = this.items.filter(val => val.id !== this.item.id);
    // // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Deleted', life: 3000 });
    // this.item = {};
  }

  hideDialog() {
    this.isVisibleUserGroupDialog = false;
  }

  selectUserGroup(userGroup: any) {
    this.selectedUserGroup = userGroup;
  }

  saveItem() {
    if (this.userGroupForm.valid) {
      if (!this.isEditUserGroup) {
        this.createUserGroup();
      } else {
        this.updateUserGroup();
      }
    } else {
      Object.values(this.userGroupForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateUserGroup() {
    this.userGroupService.update(this.userGroupService.url, this.userGroupForm.value.id, this.userGroupForm.value).subscribe({
      next: (res) => {
        this.notification.success('Cập nhật thành công', '');
        this.isVisibleUserGroupDialog = false;
      }
    });
  }

  createUserGroup() {
    this.userGroupService.create(this.userGroupService.url, this.userGroupForm.value).subscribe({
      next: (res) => {
        this.notification.success('Thêm mới thành công', '');
        this.isVisibleUserGroupDialog = false;
      }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    // for (let i = 0; i < this.items.length; i++) {
    //   if (this.items[i].id === id) {
    //     index = i;
    //     break;
    //   }
    // }

    return index;
  }

  createId(): string {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
