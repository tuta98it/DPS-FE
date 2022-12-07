import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserGroupService } from 'src/app/services/user-group.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss']
})
export class UserGroupsComponent implements OnInit {
  _isVisibleUserGroupDialog = false;
  set isVisibleUserGroupDialog(value: boolean) {
    this._isVisibleUserGroupDialog = value;
    if (!value) {
      this.userGroupForm.markAsPristine();
    }
  }
  get isVisibleUserGroupDialog() {
    return this._isVisibleUserGroupDialog;
  }
  isVisibleDeleteItemDialog = false;
  textConfirmDelete = '';
  isVisibleListUsers = false;
  userGroups: any = [];
  cols: any[] = [];
  selectedUserGroup: any = {};
  userGroupDialogHeader = '';
  isEditUserGroup = false;
  userGroupForm: FormGroup;
  deletedItem: any = {};
  searchData = {
    skip: 0,
    take: Constants.TABLE_PARAM.PAGE_SIZE,
    keyword: ''
  }
  loading = false;
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
    this.cols = [
      { field: 'name', header: 'Tên nhóm', width: '30rem' },
      { field: 'desc', header: 'Mô tả', width: '68rem' }
    ];
    this.search();
  }

  search() {
    this.loading = true;
    this.userGroupService.search(this.searchData).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.userGroups = res.jsonData.data;
          this.total = res.jsonData.total;
        }
      }
    }).add(() => {
      this.loading = false
    });
  }

  onCreateItem() {
    this.userGroupForm.patchValue({
      id: 0,
      name: '',
      desc: ''
    });
    this.isVisibleUserGroupDialog = true;
    this.isEditUserGroup = false;
    this.userGroupDialogHeader = 'Thêm mới group';
  }

  onEditItem(item: any) {
    this.userGroupForm.patchValue({
      id: item.id,
      name: item.name,
      desc: item.desc
    });
    this.isVisibleUserGroupDialog = true;
    this.isEditUserGroup = true;
    this.userGroupDialogHeader = 'Sửa thông tin group';
  }

  onDeleteItem(item: any) {
    this.textConfirmDelete = `Xác nhận xóa group <b>${item.name}</b>?`
    this.deletedItem = item;
    this.isVisibleDeleteItemDialog = true;
  }

  onPageChange(data: any) {
    this.searchData.skip = data.first;
    this.searchData.take = data.rows;
    this.search();
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
    this.userGroupService.update(this.userGroupForm.value.id, this.userGroupForm.value).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Cập nhật thành công', '');
          this.isVisibleUserGroupDialog = false;
          this.search();
        }
      }
    });
  }

  createUserGroup() {
    this.userGroupService.create(this.userGroupForm.value).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Thêm mới thành công', '');
          this.isVisibleUserGroupDialog = false;
          this.search();
        }
      }
    });
  }

  deleteUserGroup() {
    this.userGroupService.deleteById(this.deletedItem.id).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Xóa group thành công', '');
          this.isVisibleDeleteItemDialog = false;
          this.search();
        }
      }
    });
  }

  resetSearch() {
    this.searchData = {
      skip: 0,
      take: Constants.TABLE_PARAM.PAGE_SIZE,
      keyword: ''
    };
    this.search();
  }
}
