import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SourceHospitalService } from 'src/app/services/source-hospital.service';
import { NotificationService } from 'src/app/shared/notification.service';


@Component({
  selector: 'app-source-hospital',
  templateUrl: './source-hospital.component.html',
  styleUrls: ['./source-hospital.component.scss']
})
export class SourceHospitalComponent implements OnInit {
    _isVisibleSourceHospitalDialog=false;
    set isVisibleSourceHospitalDialog(value: boolean) {
        this._isVisibleSourceHospitalDialog = value;
        if(!value) {
            this.sourceHospitalForm.markAsPristine();
        }
    }
    get isVisibleSourceHospitalDialog() {
        return this._isVisibleSourceHospitalDialog;
    }

    cols:any[]=[];
    sourceHospital:any=[];
    sourceHospitalDialogHeader='';
    loading = false;
    sourceHospitalForm: FormGroup;
    sourceHospitals: any=[];
    isEditSourceHospital=false;
    isVisibleDeleteItemDialog=false;
    textConfirmDelete='';
    deletedItem: any = {};
    searchData = {
        skip: 40,
        take: 0,
        keyword: '',
      };



  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private sourceHospitalSevice: SourceHospitalService
    ) {
    this.sourceHospitalForm = this.fb.group({
        id: [null],
        name: [null, [Validators.required]],
        address: [null],
        phoneNo: [null],
      });
    }
  ngOnInit(): void {
    this.cols = [
        {field:'id', header:'Id', width:'16rem'},
        {field:'name', header:'Nơi gửi mẫu', width:'32rem'},
        {field:'address',header:'Địa chỉ', width:'34rem'},
        {field:'phoneNo',header:'Số điện thoại', width:'16rem'}
    ]
    this.getAll();
  }
  getAll() {
    this.loading=true;
    this.sourceHospitalSevice.getAll().subscribe({
        next: (res)=> {
            if(res.isValid) {
                this.sourceHospitals = res.jsonData;
            }
        }
    }).add(() => {
        this.loading= false
    });
  }
  onCreatItem() {
    this.sourceHospitalForm.reset();
    this.sourceHospitalForm.patchValue({
        id:0,
        name:'',
        address:'',
        phoneNo:''
    });
    this.isVisibleSourceHospitalDialog = true;
    this.isEditSourceHospital = false;
    this.sourceHospitalDialogHeader="Thêm mới nơi gửi mẫu";
  }
  saveItem() {
    if(this.sourceHospitalForm.valid) {
        if(!this.isEditSourceHospital) {
            this.createSourceHospital();
        } else {
            this.updateSourceHospital();
        }
    } else {
        Object.values(this.sourceHospitalForm.controls).forEach((control) => {
            if (control.invalid) {
                control.markAsDirty();
                control.updateValueAndValidity({ onlySelf:true});
            }
        });
    }
  }
  createSourceHospital() {
    this.sourceHospitalSevice.create(this.sourceHospitalForm.value).subscribe({
        next: (res) => {
           if(res.isValid) {
                this.notification.success('Thêm mới thành công','');
                this.isVisibleSourceHospitalDialog = false;
                this.getAll();
           }
        }
    });
  }
  selectSourceHospital(sourceHospital:any) {
    this.selectSourceHospital = sourceHospital;
  }
  updateSourceHospital() {
    this.sourceHospitalSevice.update(this.sourceHospitalForm.value.id,this.sourceHospitalForm.value).subscribe({
        next: (res) => {
            if(res.isValid) {
                this.notification.success('Cập nhật thành công','');
                this.isVisibleSourceHospitalDialog = false;
                this.getAll();
            }
        }
    })
  }
  onEditItem(item: any) {
    this.sourceHospitalForm.reset();
    this.sourceHospitalForm.patchValue({
      id: item.id,
      name: item.name,
      address: item.address,
      phoneNo: item.phoneNo
    });
    this.isVisibleSourceHospitalDialog = true;
    this.isEditSourceHospital = true;
    this.sourceHospitalDialogHeader = 'Sửa thông tin nơi gửi mẫu';
  }
  onDeleteItem(item:any) {
    this.deletedItem = item;
    this.textConfirmDelete = `Xác nhận xóa nơi gửi mẫu <b>${item.name}</b>?`;
    this.isVisibleDeleteItemDialog =true;
  }
  deleteSourceHospital(){
    this.sourceHospitalSevice.deleteById(this.deletedItem.id).subscribe({
        next: (res) => {
            if(res.isValid) {
                this.notification.success('Xóa nơi gửi mẫu thành công','');
                this.isVisibleDeleteItemDialog = false;
                this.getAll();
            }
        }
    });
  }
  search() {
    this.loading =true;
    this.sourceHospitalSevice.search(this.searchData).subscribe({
        next: (res) => {
            if (res.isValid) {
                this.sourceHospitals = res.jsonData.data;
                // this.sourceHospitals.forEach((u:any) => (u.enable = !u.disable));
                // this.total = res.jsonData.total;
            }
        }
    }).add(() => {
        this.loading = false;
    })
  }
  resetSearch() {
    this.searchData = {
        skip: 40,
        take: 0,
        keyword: '',
    };
    this.search();
  }

}




