import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderDoctorService } from 'src/app/services/order-doctor.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-order-doctor',
  templateUrl: './order-doctor.component.html',
  styleUrls: ['./order-doctor.component.scss']
})
export class OrderDoctorComponent implements OnInit {
  _isVisibleOrderDoctorDialog = false;
  set isVisibleOrderDoctorDialog(value: boolean) {
    this._isVisibleOrderDoctorDialog = value;
    if(!value) {
      this.orderDoctorForm.markAsPristine();
    }
  }
  get isVisibleOrderDoctorDialog() {
    return this._isVisibleOrderDoctorDialog;
  }
  isVisibleDeleteItemDialog = false;
  orderDoctors: any = [];
  cols: any[] = [];
  selectedOrderDoctor = {};
  orderDoctorDialogHeader = '';
  isEditOrderDoctor = false;
  orderDoctorForm: FormGroup;
  deletedItem: any = {};
  textConfirmDelete = '';
  loading = false;
  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private orderDoctorService: OrderDoctorService,
  ) {
    this.orderDoctorForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],                                                                  
      phoneNo: [null],
      hisCode: [null],
    })
  }

  ngOnInit(): void {
    this.cols = [
      {field: 'id', header:'Id', width: '23rem'},
      {field: 'name', header: 'Tên bác sĩ chỉ định', width: '32rem'},
      {field: 'phoneNo', header: 'SĐT', width: '16rem'},
      {field: 'hisCode', header: 'Mã Code', width: '23rem'},
    ];
    this.getAll();
  }
  getAll() {
    this.loading = true;
    this.orderDoctorService.getAll().subscribe ({
      next: (res) => {
        if (res.isValid) {
          this.orderDoctors = res.jsonData;
        }
      }
    }) .add(() => {
      this.loading = false
    });
  }
  onCreateItem() {
    this.orderDoctorForm.reset();
    this.orderDoctorForm.patchValue({
      id: 0,
      name: '',
      phoneNo: '',
      hisCode: '',
    });
    this.isVisibleOrderDoctorDialog = true;
    this.isEditOrderDoctor = false;
    this.orderDoctorDialogHeader = 'Thêm mới bác sĩ chỉ định';
  }
  onEditItem(item: any) {
    this.orderDoctorForm.reset();
    this.orderDoctorForm.patchValue ({
      id: item.id,
      name: item.name,
      phoneNo: item.phoneNo,
      hisCode: item.hisCode,
    });
    this.isVisibleOrderDoctorDialog = true;
    this.isEditOrderDoctor = true;
    this.orderDoctorDialogHeader = 'Sửa thông tin bác sĩ chỉ định';
  }
  onDeleteItem(item: any) {
    this.deletedItem = item;
    this.textConfirmDelete = `Xác nhận xóa bác sĩ chỉ định <b>${item.name}</b>?`
    this.isVisibleDeleteItemDialog = true;
  }
  selectOrderDoctor(orderDoctor: any) {
    this.selectOrderDoctor = orderDoctor;
  }
  saveItem() {
    if(this.orderDoctorForm.valid) {
      if(!this.isEditOrderDoctor) {
        this.createOrderDoctor();
      } else {
        this.updateOrderDoctor();
      }
    } else {
      Object.values(this.orderDoctorForm.controls).forEach((control) => {
        if(control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }
  updateOrderDoctor() {
    this.orderDoctorService.update(this.orderDoctorForm.value.id, this.orderDoctorForm.value).subscribe({
      next:  (res) => {
        if (res.isValid) {
          this.notification.success('Cập nhật thành công', '');
          this.isVisibleOrderDoctorDialog = false;
          this.getAll();
        }
      }
    });
  }
  createOrderDoctor() {
    this.orderDoctorService.create(this.orderDoctorForm.value).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Thêm mới thành công', '');
          this.isVisibleOrderDoctorDialog = false;
          this.getAll();
        }
      }
    });
  }
  deleteOrderDoctor() {
    this.orderDoctorService.deleteById(this.deletedItem.id).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Xóa bác sĩ chỉ định thành công', '');
          this.isVisibleDeleteItemDialog = false;
          this.getAll();
        }
      }
    });
  }
}
