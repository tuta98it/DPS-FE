import { Component, OnInit } from '@angular/core';
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
  isVisibleUserDialog = false;
  isVisibleUserEdit = false;
  isEditUser = false;
  isVisibleDisableUserDialog = false;
  textConfirmDisableUser = '';
  disableItem: any = {};
  userDialogHeader = '';
  searchData = {
    skip: 0,
    take: Constants.TABLE_PARAM.PAGE_SIZE,
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
  isVisibleListGroups = false;


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
      repass: [null, [Validators.required, this.confirmationValidator]]
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
    })
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.usersForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };;


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
          console.log('user', this.users)
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
      take: Constants.TABLE_PARAM.PAGE_SIZE,
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
    });
    this.isVisibleUserDialog = true;
    this.isEditUser = false;
    this.userDialogHeader = 'Thêm tài khoản mới';
  }
  onEditUser(item: any) {
    this.usersFormEdit.patchValue({
      id: item.id,
      fullname: item.fullname,
      email: item.email,
      phoneNo: item.phoneNo,
      username: item.username,
      password: '********'
    });
    this.isVisibleUserEdit = true;
    this.isEditUser = true;
    this.userDialogHeader = 'Sửa thông tin tài khoản';
  }
  saveItem() {
    console.log("usersForm", this.usersForm.valid);
    console.log("isEditUser", this.isEditUser)
    if (this.usersForm.valid && !this.isEditUser) {
      console.log('thêm');
      this.createUser();
    } else {
      console.log('không thêm được');
      Object.values(this.usersForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  saveItemEdit() {
    console.log("usersForm", this.usersFormEdit.valid);
    console.log("isEditUser", this.isEditUser)
    if (this.usersFormEdit.valid && this.isEditUser) {
      console.log('sửa');
      this.updateUser();
    } else {
      console.log('không sửa được');
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
      phoneNo: formValue.phoneNo
    }
    this.userService.registerUser(payload).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Thêm mới thành công', '');
          this.isVisibleUserDialog = false;
          this.search();
        }
        else {

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
      password: formEditValue.password
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
    this.usersFormEdit.patchValue({
      disable: item.disable,
      enable: item.enable,
      id: item.id,
      fullname: item.fullname,
      email: item.email,
      phoneNo: item.phoneNo,
      username: item.username,
      password: '********'
    });
    console.log(item)
    if (item.enable == false) {
      console.log(item.enable);
      console.log(item.disable);
      this.textConfirmDisableUser = `Xác nhận Disable tài khoản này <b>${item.username}?`;
      this.confirmLabelDisable = "Disable";
      this.isVisibleDisableUserDialog = true;
    }
    else {
      this.isVisibleDisableUserDialog = false;
      this.search();
    }
  }
  disableUser() {
    const formEditValue = this.usersFormEdit.value;      // làm thế nào không gọi đến form mà vẫn lấy được id.
    this.userService.updateDisable(formEditValue.id).subscribe({
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
    const formEditValue = this.usersFormEdit.value;
    formEditValue.enable = true;
    this.search();
  }
  onListGroup() {

  }

  isVisibleListGroup() {
    this.isVisibleListGroups = true;
  }
  selectUser(user: any) {
    this.selectedUser = user;
  }





}
