import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { Constants } from 'src/app/shared/constants/constants';

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
  @Input() isHistory = false;
  @Input() caseStudyId = '';

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
              if (res.jsonData == Constants.REPORT_EDITING_STATES.READING) {
                this.readingReport();
              } else if (res.jsonData == Constants.REPORT_EDITING_STATES.APPROVING) {
                this.approvingReport();
              }
            }
          }
        });
      } else {
        this.isDisable = false;
        if (template) {
          this.applyTemplate(template);
        }
        this.reportService.create({ ...this.reportForm, caseStudyId: this.caseStudyId }).subscribe({
          next: (res) => {
            if (res.isValid) {
              this.reportForm['id'] = res.jsonData.id;
            }
          }
        });
      }
    }
  } 

  readingReport() {
    this.reportService.reading(this.reportForm['id']).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.reportForm.state = Constants.REPORT_STATES[1].value;
          this.reportForm.stateLabel = Constants.REPORT_STATES[1].label;
        }
      }
    });
  }

  approvingReport() {
    this.reportService.approving(this.reportForm['id']).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.reportForm.state = Constants.REPORT_STATES[3].value;
          this.reportForm.stateLabel = Constants.REPORT_STATES[3].label;
        }
      }
    });
  }

  applyTemplate(template: any) {
    this.reportForm.microbodyDescribe = template.microbodyDescribe;
    this.reportForm.diagnose = template.diagnose;
    this.reportForm.discuss = template.discuss;
    this.reportForm.recommendation = template.recommendation;
    this.reportForm.consultation = template.consultation;
  }
}
