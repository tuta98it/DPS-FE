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

  @Input() reportTabIndex = 0;
  
  _isDisable = true;
  @Input() set isDisable(value: boolean) {
    this._isDisable = value;
    this.isDisableChange.emit(value);
  }
  get isDisable() {
    return this._isDisable;
  }
  @Output() isDisableChange = new EventEmitter<any>();

  @Input() isTemplate = false;
  
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
  
  checkReport(template:any=null) {
    if (this.isDisable || template != null) {
      if (this.reportForm['id'] != '') {
        this.reportService.check(this.reportForm['id']).subscribe({
          next: (res) => {
            if (res.isValid) {
              this.isDisable = false;
              if (template) {
                this.applyTemplate(template);
              }
            }
          }
        });
      } else {
        this.isDisable = false;
      }
    }
  } 

  applyTemplate(template: any) {
    this.reportForm.microbodyDescribe = template.microbodyDescribe;
    this.reportForm.diagnose = template.diagnose;
    this.reportForm.discuss = template.discuss;
    this.reportForm.recommendation = template.recommendation;
    this.reportForm.consultation = template.consultation;
  }
}
