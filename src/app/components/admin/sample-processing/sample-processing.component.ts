import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TechnicianService } from 'src/app/services/technician.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-sample-processing',
  templateUrl: './sample-processing.component.html',
  styleUrls: ['./sample-processing.component.scss']
})
export class SampleProcessingComponent implements OnInit {
  _isVisibleSampleProcessingDialog = false;
  set isVisibleSampleProcessingDialog(value: boolean) {
    this._isVisibleSampleProcessingDialog = value;
    if(!value) {
      this.sampleProcessingForm.markAsPristine();
    }
  }
  get isVisibleSampleProcessingDialog() {
    return this._isVisibleSampleProcessingDialog;
  }
  isVisibleDeleteItemDialog = false;
  sampleProcessings: any = [];
  cols: any[] = [];
  selectedSampleProcessing = {};
  sampleProcessingDialogHeader = '';
  isEditSampleProcessing = false;
  sampleProcessingForm: FormGroup;
  deletedItem: any = {};
  textConfirmDelete = '';
  loading = false;
  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private sampleProcessingService: TechnicianService,
  ) { 
    this.sampleProcessingForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      phoneNo: [null],
      hisCode: [null],
    });
  }

  ngOnInit(): void {
    this.cols = [
      {field: 'id', header: 'Id', width: '23rem'},
      {field: 'name', header: 'Tên KTV xử lí mẫu', width: '32rem'},
      {field: 'phoneNo', header: 'SĐT', width: '16rem'},
      {field: 'hisCode', header: 'Mã code', width: '23rem'},
    ];
    this.getAll();
  }
  getAll() {
    this.loading = true;
    this.sampleProcessingService.getAll().subscribe({
      next: (res) => {
        if (res.isValid){
          this.sampleProcessings = res.jsonData;
        }
      }
    }).add(() => {
      this.loading = false
    });
  }
  onCreateItem() {
    this.sampleProcessingForm.reset();
    this.sampleProcessingForm.patchValue({
      id: 0,
      name: '',
      phonNo: '',
      hisCode: '',
    });
    this.isVisibleSampleProcessingDialog = true;
    this.isEditSampleProcessing = false;
    this.sampleProcessingDialogHeader = 'Thêm mới KTV xử lí mẫu';
  }
  onEditItem(item: any) {
    this.sampleProcessingForm.reset();
    this.sampleProcessingForm.patchValue({
      id: item.id,
      name: item.name,
      phoneNo: item.phoneNo,
      hisCode: item.hisCode,
    });
    this.isVisibleSampleProcessingDialog = true;
    this.isEditSampleProcessing = true;
    this.sampleProcessingDialogHeader = 'Sửa thông tin KTV xử lí mẫu';
  } 
  onDeleteItem(item: any) {
    this.deletedItem = item;
    this.textConfirmDelete = `Xác nhận xóa KTV xử lí mẫu <b>${item.name}</b>?`
    this.isVisibleDeleteItemDialog = true;
  }
  selectSampleProcessing(sampleProcessing: any) {
    this.selectSampleProcessing = sampleProcessing;
  }
  saveItem() {
    if(this.sampleProcessingForm.valid) {
      if(!this.isEditSampleProcessing) {
        this.createSampleProcessing();
      } else {
        this.updateSampleProcessing();
      }
    } else {
      Object.values(this.sampleProcessingForm.controls).forEach((control) => {
        if(control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }
  updateSampleProcessing() {
    this.sampleProcessingService.update(this.sampleProcessingForm.value.id, this.sampleProcessingForm.value).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Cập nhật thành công', '');
          this.isVisibleSampleProcessingDialog = false;
          this.getAll();
        }
      }
    });
  }
  createSampleProcessing() {
    this.sampleProcessingService.create(this.sampleProcessingForm.value).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Thêm mới thànhh công', '');
          this.isVisibleSampleProcessingDialog = false;
          this.getAll();

        }
      }
    });
  }
  deleteSampleProcessing() {
    this.sampleProcessingService.deleteById(this.deletedItem.id).subscribe ({
      next: (res) => {
        if(res.isValid) {
          this.notification.success('Xóa KTV xử lí mẫu thành công', '');
          this.isVisibleDeleteItemDialog = false;
          this.getAll();
        }
      }
    })
  }
}
