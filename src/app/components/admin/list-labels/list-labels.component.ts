import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListLabelsService } from 'src/app/services/list-labels.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
    selector: 'app-list-labels',
    templateUrl: './list-labels.component.html',
    styleUrls: ['./list-labels.component.scss'],
})
export class ListLabelsComponent implements OnInit {
    color2: any = {
        h: 100,
        s: 50,
        b: 50,
    };

    _isVisibleLabelDialog = false;
    set isVisibleLabelDialog(value: boolean) {
        this._isVisibleLabelDialog = value;
        if (!value) {
            this.labelForm.markAsPristine();
        }
    }
    get isVisibleLabelDialog() {
        return this._isVisibleLabelDialog;
    }
    isVisibleDeleteItemDialog = false;
    listLabels: any = [];
    cols: any[] = [];
    selectedLabel: any;
    listLabelDialogHeader = '';
    isEditLabel = false;
    labelForm: FormGroup;
    deletedItem: any = {};
    textConfirmDelete = '';
    loading = false;
    constructor(
        private fb: FormBuilder,
        private notification: NotificationService,
        private listLabelsService: ListLabelsService
    ) {
        this.labelForm = this.fb.group({
            id: [0],
            name: ['', [Validators.required]],
            color: ['#FFE7CC', [Validators.required]],
            priority: [''],
            disable: [false],
        });
    }

    ngOnInit() {
        this.cols = [
            { field: 'id', header: 'Id', width: '10rem' },
            { field: 'name', header: 'Tên nhãn', width: '20rem' },
            { field: 'priority', header: 'Độ ưu tiên', width: '20rem' },
        ];
        this.getAll();
    }

    getAll() {
        this.loading = true;
        this.listLabelsService
            .getAll()
            .subscribe({
                next: (res) => {
                    if (res.isValid) {
                        this.listLabels = res.jsonData;
                    }
                },
            })
            .add(() => {
                this.loading = false;
            });
    }

    onCreateItem() {
        this.labelForm.reset();
        this.labelForm.patchValue({
            id: 0,
            name: '',
            color: '#ffffff',
            priority: '',
            disable: false,
        });
        this.isVisibleLabelDialog = true;
        this.isEditLabel = false;
        this.listLabelDialogHeader = 'Thêm mới label';
    }

    onEditItem(item: any) {
        this.selectedLabel = item;
        this.labelForm.reset();
        this.labelForm.patchValue({
            id: item.id,
            name: item.name,
            color: item.color,
            priority: item.priority,
        });
        this.isVisibleLabelDialog = true;
        this.isEditLabel = true;
        this.listLabelDialogHeader = 'Sửa thông tin label';
    }

    onDeleteItem(item: any) {
        this.deletedItem = item;
        this.textConfirmDelete = `Xác nhận xóa label <b>${item.name}</b>?`;
        this.isVisibleDeleteItemDialog = true;
    }

    selectLabel(label: any) {
        this.selectedLabel = label;
    }

    saveItem() {
        if (this.labelForm.valid) {
            if (!this.isEditLabel) {
                this.createLabel();
            } else {
                this.updateLabel();
            }
        } else {
            Object.values(this.labelForm.controls).forEach((control) => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    updateLabel() {
        this.listLabelsService
            .update(this.labelForm.value.id, {
                ...this.labelForm.value,
                disable: this.selectedLabel.disable,
            })
            .subscribe({
                next: (res) => {
                    if (res.isValid) {
                        this.notification.success('Cập nhật thành công', '');
                        this.isVisibleLabelDialog = false;
                        this.getAll();
                    }
                },
            });
    }

    createLabel() {
        this.listLabelsService.create(this.labelForm.value).subscribe({
            next: (res) => {
                if (res.isValid) {
                    this.notification.success('Thêm mới thành công', '');
                    this.isVisibleLabelDialog = false;
                    this.getAll();
                }
            },
        });
    }

    deleteLabel() {
        this.listLabelsService.deleteById(this.deletedItem.id).subscribe({
            next: (res) => {
                if (res.isValid) {
                    this.notification.success('Xóa label thành công', '');
                    this.isVisibleDeleteItemDialog = false;
                    this.getAll();
                }
            },
        });
    }
    toggle(item: any) {
        let payload = {
            name: item.name,
            color: item.color,
            priority: item.priority,
            disable: !item.disable,
        };
        this.listLabelsService.update(item.id, payload).subscribe({
            next: (res) => {
                if (res.isValid) {
                    this.notification.success(
                        'Cập nhật trạng thái thành công',
                        ''
                    );
                    this.getAll();
                }
            },
        });
    }
}
