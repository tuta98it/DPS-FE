import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BodyPartService } from 'src/app/services/body-part.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-body-parts',
  templateUrl: './body-parts.component.html',
  styleUrls: ['./body-parts.component.scss']
})
export class BodyPartsComponent implements OnInit {
  _visibleBodyPartDialog = false;
  set visibleBodyPartDialog(value: boolean) {
    this._visibleBodyPartDialog = value;
    if (!value) {
      this.bodyPartForm.markAsPristine();
    }
  }
  get visibleBodyPartDialog() {
    return this._visibleBodyPartDialog;
  }

  bodyParts: any = [];
  cols: any[] = [];
  selectedBodyPart = {};
  bodyPartDialogHeader = '';
  isEditBodyPart = false;
  bodyPartForm: FormGroup;

  loading = false;

  searchData = {
    skip: 0,
    take: 40,
    keyword: '',
  };
  total = 0;

  constructor(
    private fb: FormBuilder,
    private bodyPartService: BodyPartService,
    private notification: NotificationService,
  ) {
    this.bodyPartForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      description: [null],
      disable: [null],
    });
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'Id', width: '16rem' },
      { field: 'name', header: 'Tên vị trí lấy mẫu', width: '16rem' },
      { field: 'description', header: 'Mô tả', width: '50rem' }
    ];
    this.search();
  }

  search() {
    this.loading = true;
    this.bodyPartService.search(this.searchData).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.bodyParts = res.jsonData.data;
          this.bodyParts.forEach((u: any) => {
            u.enable = !u.disable;
          });
          this.total = res.jsonData.total;
        }
      },
    }).add(() => {
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

  toggle(item: any) {
    this.bodyPartService.toggle(item.id).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Cập nhật trạng thái thành công', '');
          this.search();
        }
      }
    });
  }

  saveItem() {
    if (this.bodyPartForm.valid) {
      if (!this.isEditBodyPart) {
        this.createBodyPart();
      } else {
        this.updateBodyPart();
      }
    } else {
      Object.values(this.bodyPartForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateBodyPart() {
    this.bodyPartService.update(this.bodyPartForm.value.id, this.bodyPartForm.value).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Cập nhật thành công', '');
          this.visibleBodyPartDialog = false;
          this.search();
        }
      }
    });
  }

  createBodyPart() {
    this.bodyPartService.create(this.bodyPartForm.value).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Thêm mới thành công', '');
          this.visibleBodyPartDialog = false;
          this.search();
        }
      }
    });
  }

  onCreateItem() {
    this.bodyPartForm.reset();
    this.bodyPartForm.patchValue({
      id: 0,
      name: '',
      description: '',
      disable: false
    });
    this.visibleBodyPartDialog = true;
    this.isEditBodyPart = false;
    this.bodyPartDialogHeader = 'Thêm mới vị trí lấy mẫu';
  }

  onEditItem(item: any) {
    this.bodyPartForm.reset();
    this.bodyPartForm.patchValue({
      id: item.id,
      name: item.name,
      description: item.describe,
      disable: item.disable
    });
    this.visibleBodyPartDialog = true;
    this.isEditBodyPart = true;
    this.bodyPartDialogHeader = 'Sửa thông tin vị trí lấy mẫu';
  }

  selectItem(bodyPart: any) {
    this.selectedBodyPart = bodyPart;
  }

  onPageChange(data: any) {
    this.searchData.skip = data.first;
    this.searchData.take = data.rows;
    this.search();
  }
}
