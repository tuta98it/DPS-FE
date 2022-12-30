import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification.service';
import { Constants } from 'src/app/shared/constants/constants';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';



@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {
  _isVisibleUserDialog = false;
  set isVisibleUserDialog(value: boolean) {
    this._isVisibleUserDialog = value;
    if (!value) {
      this.usersForm.markAsPristine();
    }
  }
  get isVisibleUserDialog() {
    return this._isVisibleUserDialog;
  }
  _isVisibleUserEdit = false;
  set isVisibleUserEdit(value: boolean) {
    this._isVisibleUserEdit = value;
    if (!value) {
      this.usersForm.markAsPristine();
    }
  }
  get isVisibleUserEdit() {
    return this._isVisibleUserEdit;
  }
  isEditUser = false;
  isVisibleDisableUserDialog = false;
  isVisibleEnableUserDialog = false;
  textConfirmDisableUser = '';
  textConfirmEnableUser = '';
  disableItem: any = {};
  userDialogHeader = '';
  searchData = {
    skip: 0,
    take: 40,
    keyword: '',
  };
  loading = false;
  total = 0;
  users: any = [];
  cols: any[] = [];
  selectedUser: any = {};
  usersForm: FormGroup;
  usersFormEdit: FormGroup;
  confirmLabelDisable = "";
  confirmLabelEnable = "";
  isVisibleListGroups = false;

  _isVisibleAddAccountDialog = false;
  set isVisibleAddAccountDialog(value: boolean) {
    this._isVisibleAddAccountDialog = value;
    if (!value) {
      this.accountForm.markAsPristine();
    }
  }
  get isVisibleAddAccountDialog() {
    return this._isVisibleAddAccountDialog;
  }
  accountForm: FormGroup;
  disabledUserId = '';
  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private userService: UserService
  ) {
    this.usersForm = this.fb.group({
      id: [null],
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phoneNo: [null],
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      repass: [null, [Validators.required, this.confirmationValidator]],
      hisCode:[null],
    });
    this.usersFormEdit = this.fb.group({
      id: [null],
      fullname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phoneNo: [null],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      disable: [null],
      enable: [null],
      hisCode:[null],
    })
    this.accountForm = this.fb.group({
      username: [null, [Validators.required]],
    })
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.usersForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  }


  ngOnInit(): void {
    this.cols = [
      { field: 'fullname', header: 'Họ và tên', width: '15rem' },
      { field: 'username', header: 'Tài khoản', width: '15rem' },
      { field: 'phoneNo', header: 'SĐT', width: '15rem' },
      { field: 'email', header: 'Email', width: '50rem' },
    ];
    this.search();
  }

  search() {
    this.loading = true;
    this.userService.getUsers(this.searchData).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.users = res.jsonData.data;
          this.users.forEach((u: any) => (u.enable = !u.disable));
          this.total = res.jsonData.total;
        }
      },
    })
      .add(() => {
        this.loading = false;
      });
  }

  resetSearch() {
    this.searchData = {
      skip: 0,
      take: 40,
      keyword: '',
    };
    this.search();
  }

  onPageChange(data: any) {
    this.searchData.skip = data.first;
    this.searchData.take = data.rows;
    this.search();
  }
  onCreatUser() {
    this.usersForm.patchValue({
      id: 0,
      fullName: '',
      email: '',
      phoneNo: '',
      username: '',
      password: '',
      repass: '',
      hisCode:'',
    });
    this.isVisibleUserDialog = true;
    this.isEditUser = false;
    this.userDialogHeader = 'Thêm tài khoản mới';
  }
  onCreateAccount() {
    this.accountForm.patchValue({
      username: ''
    });
    this.isVisibleAddAccountDialog = true;
    this.isEditUser = false;
  }
  onEditUser(item: any) {
    this.usersFormEdit.patchValue({
      id: item.id,
      fullname: item.fullname,
      email: item.email,
      phoneNo: item.phoneNo,
      username: item.username,
      password: '********',
      hisCode: item.hisCode
    });
    this.isVisibleUserEdit = true;
    this.isEditUser = true;
    this.userDialogHeader = 'Sửa thông tin tài khoản';
  }
  saveItem() {
    if (this.usersForm.valid && !this.isEditUser) {
      this.createUser();
    } else {
      Object.values(this.usersForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  saveAccount() {
    if (this.accountForm.valid && !this.isEditUser) {
      this.createAccount();
    } else {
      Object.values(this.accountForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  saveItemEdit() {
    if (this.usersFormEdit.valid && this.isEditUser) {
      this.updateUser();
    } else {
      Object.values(this.usersFormEdit.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  createUser() {
    const formValue = this.usersForm.value;
    const payload = {
      username: formValue.username,
      fullName: formValue.fullName,
      password: formValue.password,
      email: formValue.email,
      phoneNo: formValue.phoneNo,
    }
    this.userService.registerUser(payload).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Thêm mới thành công', '');
          this.isVisibleUserDialog = false;
          this.search();
        }
      }
    });
  }
  createAccount() {
    const formValue = this.accountForm.value;
    const payload = {
      username: formValue.username,
    }
    this.userService.addUsername(payload).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Thêm thành công', '');
          this.isVisibleDisableUserDialog = false;
          this.search();
        }
      }
    });
  }
  updateUser() {
    const formEditValue = this.usersFormEdit.value;
    const payloadEdit = {
      id: formEditValue.id,
      fullname: formEditValue.fullname,
      email: formEditValue.email,
      phoneNo: formEditValue.phoneNo,
      username: formEditValue.username,
      password: formEditValue.password,
      hisCode: formEditValue.hisCode,
    }
    this.userService.update(formEditValue.id, payloadEdit).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Cập nhật thành công', '');
          this.isVisibleUserEdit = false;
          this.search();
        }
      }
    });
  }

  onChangeEnable(item: any) {
    if (!item.enable) {
        this.disabledUserId = item.id;
        this.textConfirmDisableUser = `Xác nhận Disable tài khoản này <b>${item.username}?`;
        this.confirmLabelDisable = "Disable";
        this.isVisibleDisableUserDialog = true;
    }
    else {
        this.disabledUserId = item.id;
        this.textConfirmEnableUser = `Xác nhận Enable tài khoản này <b>${item.username}?`;
        this.confirmLabelEnable = "Enable";
        this.isVisibleEnableUserDialog = true;
    }
  }
  disableUser() {
    this.userService.updateDisable(this.disabledUserId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Disable User thành công', '');
          this.isVisibleDisableUserDialog = false;
          this.search();
        }
      }
    });
  }
  cancelDisable() {
    this.search();
  }
  enableUser() {
    this.userService.updateDisable(this.disabledUserId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Enable User thành công', '');
          this.isVisibleEnableUserDialog = false;
          this.search();
        }
      }
    });
  }
  cancelEnable() {
    this.search();
  }
  selectUser(user: any) {
    this.selectedUser = user;
  }
  openListGroups(){
    this.isVisibleListGroups=true;
  }

}
