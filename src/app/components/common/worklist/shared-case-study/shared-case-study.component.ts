import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { INIT_SHARED_CASE_STUDY } from 'src/app/models/shared-case-study';
import { SharedCasestudyService } from 'src/app/services/shared-casestudy.service';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'shared-case-study',
  templateUrl: './shared-case-study.component.html',
  styleUrls: ['./shared-case-study.component.scss']
})
export class SharedCaseStudyComponent implements OnInit {
  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
    if (!value) {
      this.sharedData = JSON.parse(JSON.stringify(INIT_SHARED_CASE_STUDY));
    }
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();

  _caseStudyId = new String('');
  @Input() set caseStudyId(data: String) {
    this._caseStudyId = data;
    if (this.visible) {
      if (data != '') {
        this.sharedData.casestudyId = data+'';
        this.getSharedCaseStudies();
      }
    }
  }
  get caseStudyId() {
    return this._caseStudyId;
  }

  SHARED_PERIODS = Constants.SHARED_PERIODS;
  
  sharedData = {
    casestudyId: '',
    hideInfo: true,
    time: 4
  }

  sharedCaseStudies: any[] = [];
  @ViewChild("coppiedText") coppiedText!: OverlayPanel;

  visibleDelete = false;
  textConfirmDelete = '';
  deletedToken = '';
  sharedUrl = '';

  constructor(
    private sharedCaseStudyService: SharedCasestudyService,
    private notification: NotificationService,
    protected configService: AppConfigService,
  ) { 
    this.sharedUrl = this.configService.getConfig().sharedUrl;
  }

  ngOnInit(): void {

  }

  getSharedCaseStudies() {
    // this.sharedCaseStudies = [{
    //   "id": "63abcd44939f4b632c59bba3",
    //   "expiredTime": "11:59 27/01/2023",
    //   "hideInfo": "Có",
    //   "token": "778098c9b89883ea9fc1d0a4cf9aa614",
    //   "shareLink": "http://localhost:33119/ShareCasestudy/CaseStudy/778098c9b89883ea9fc1d0a4cf9aa614"
    // }];
    this.sharedCaseStudyService.getCaseStudyLinks(this.caseStudyId+'').subscribe({
      next: (res) => {
        if (res.isValid) {
          res.jsonData.forEach((l: any) => {
            l['sharedLink'] = `${this.sharedUrl}/${l.token}`;
          });
          this.sharedCaseStudies = res.jsonData;
        }
      }
    });
  }

  shareCaseStudy() {
    this.sharedCaseStudyService.create(this.sharedData).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.getSharedCaseStudies();
          this.notification.success('Tạo link chia sẻ thành công!')
        }
      }
    });
  }

  copyLink(event: any, token: string) {
    let link = `${this.sharedUrl}/${token}`;
    navigator.clipboard.writeText(link);
    this.coppiedText.toggle(event);
    setTimeout(() => {
      this.coppiedText.toggle(event);
    }, 1000);
  }

  removeSharedCaseStudy() {
    this.sharedCaseStudyService.deleteById(this.deletedToken).subscribe({
      next: (res) => {
        if (res.d.isValid) {
          this.getSharedCaseStudies();
          this.notification.success('Xóa link chia sẻ thành công!');
        }
      }
    }).add(() => {
      this.visibleDelete = false;
    });
  }

  onRemoveSharedCaseStudy(data: any) {
    this.deletedToken = data.token;
    this.textConfirmDelete = `Xác nhận xóa link chia sẻ có thời hạn <b>${data.expiredTime}</b>?`;
    this.visibleDelete = true;
  }
}
