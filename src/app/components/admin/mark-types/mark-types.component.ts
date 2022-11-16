import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarkTypeService } from 'src/app/services/mark-type.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-mark-types',
  templateUrl: './mark-types.component.html',
  styleUrls: ['./mark-types.component.scss']
})
export class MarkTypesComponent implements OnInit {
  isVisibleMarkTypeDialog = false;
  isVisibleDeleteItemDialog = false;
  markTypes: any = [];
  cols: any[] = [];
  selectedMarkType = {};
  markTypeDialogHeader = '';
  isEditMarkType = false;
  markTypeForm: FormGroup;
  deletedItem: any = {};
  loading = false;
  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private markTypeService: MarkTypeService
  ) {
    this.markTypeForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      describe: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'Id', width: '30rem' },
      { field: 'name', header: 'Tên phương pháp nhuộm', width: '30rem' },
      { field: 'describe', header: 'Mô tả', width: '50rem' }
    ];
    this.getAll();
  }

  getAll() {
    this.loading = true;
    this.markTypeService.getAll(this.markTypeService.url).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.markTypes = res.jsonData;
        }
      }
    }).add(() => {
      this.loading = false
    });
  }

  onCreateItem() {
    this.markTypeForm.reset();
    this.markTypeForm.patchValue({
      id: 0,
      name: '',
      describe: ''
    });
    this.isVisibleMarkTypeDialog = true;
    this.isEditMarkType = false;
    this.markTypeDialogHeader = 'Thêm mới phương pháp nhuộm';
  }

  onEditItem(item: any) {
    this.markTypeForm.reset();
    this.markTypeForm.patchValue({
      id: item.id,
      name: item.name,
      describe: item.describe
    });
    this.isVisibleMarkTypeDialog = true;
    this.isEditMarkType = true;
    this.markTypeDialogHeader = 'Sửa thông tin phương pháp nhuộm';
  }

  onDeleteItem(item: any) {
    this.deletedItem = item;
    this.isVisibleDeleteItemDialog = true;
  }

  selectMarkType(markType: any) {
    this.selectedMarkType = markType;
  }

  saveItem() {
    if (this.markTypeForm.valid) {
      if (!this.isEditMarkType) {
        this.createMarkType();
      } else {
        this.updateMarkType();
      }
    } else {
      Object.values(this.markTypeForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateMarkType() {
    this.markTypeService.update(this.markTypeService.url, this.markTypeForm.value.id, this.markTypeForm.value).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Cập nhật thành công', '');
          this.isVisibleMarkTypeDialog = false;
          this.getAll();
        }
      }
    });
  }

  createMarkType() {
    this.markTypeService.create(this.markTypeService.url, this.markTypeForm.value).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Thêm mới thành công', '');
          this.isVisibleMarkTypeDialog = false;
          this.getAll();
        }
      }
    });
  }

  deleteMarkType() {
    this.markTypeService.deleteById(this.markTypeService.url, this.deletedItem.id).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Xóa phương pháp nhuộm thành công', '');
          this.isVisibleDeleteItemDialog = false;
          this.getAll();
        }
      }
    });
  }
}
