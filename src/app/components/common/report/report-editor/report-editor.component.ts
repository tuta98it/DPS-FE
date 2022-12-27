import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'report-editor',
  templateUrl: './report-editor.component.html',
  styleUrls: ['./report-editor.component.scss']
})
export class ReportEditorComponent implements OnInit {
  fields: any[] = [];
  @Input() reportForm: any = {
    microbodyDescribe: '',
    diagnose: '',
    discuss: '',
    recommendation: '',
    consultation: '',
    id: '',
  };
  @Input() height = 0;
  
  _isDisable = true;
  @Input() set isDisable(value: boolean) {
    this._isDisable = value;
    this.isDisableChange.emit(value);
  }
  get isDisable() {
    return this._isDisable;
  }
  @Output() isDisableChange = new EventEmitter<any>();

  constructor(
    private reportService: ReportService
  ) { 
    this.fields = [
      { key: 'microbodyDescribe', label: 'Mô tả vi thể', value: '' },
      { key: 'diagnose', label: 'Chẩn đoán', value: '' },
      { key: 'discuss', label: 'Bàn luận', value: '' },
      { key: 'recommendation', label: 'Khuyến nghị', value: '' },
      { key: 'consultation', label: 'Hội chẩn', value: '' },
    ];
  }

  ngOnInit(): void {
  }
  
  checkReport() {
    if (this.isDisable) {
      if (this.reportForm['id'] != '') {
        this.reportService.check(this.reportForm['id']).subscribe({
          next: (res) => {
            if (res.isValid) {
              this.isDisable = false;
            }
          }
        });
      } else {
        this.isDisable = false;
      }
    }
  } 

}
