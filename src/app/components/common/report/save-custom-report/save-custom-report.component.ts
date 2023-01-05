import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportTemplateService } from 'src/app/services/report-template.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'save-custom-report',
  templateUrl: './save-custom-report.component.html',
  styleUrls: ['./save-custom-report.component.scss']
})
export class SaveCustomReportComponent implements OnInit {
  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();
  @Output() onSave = new EventEmitter<any>();
  
  templateForm: FormGroup;
  @Input() report = {
    microbodyDescribe: '',
    diagnose: '',
    discuss: '',
    recommendation: '',
    consultation: '',
  }
  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private reportTemplateService: ReportTemplateService,
  ) { 
    this.templateForm = this.fb.group({
      templateName: [null, [Validators.required]],
      code: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  save() {
    if (this.templateForm.valid) {
      this.reportTemplateService.createCustomTemplate({...this.report, ...this.templateForm.value}).subscribe({
        next: (res) => {
          if (res.isValid) {
            this.notification.success('Lưu mẫu báo thành công', '');
            this.onSave.emit();
            this.visible = false;
          }
        }
      });
    } else {
      Object.values(this.templateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
