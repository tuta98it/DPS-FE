import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { LogService } from 'src/app/services/log.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'case-study-history',
  templateUrl: './case-study-history.component.html',
  styleUrls: ['./case-study-history.component.scss']
})
export class CaseStudyHistoryComponent implements OnInit {
  _caseStudyId = new String('');
  @Input() set caseStudyId(data: String) {
    this._caseStudyId = data;
    if (data != '') {
      this.getCaseStudy();
      this.getCaseStudyHistory();
    }
  }
  get caseStudyId() {
    return this._caseStudyId;
  }
  header = 'Lịch sử ca khám';

  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();
  logs: any[] = [];
  users: any[] = [];

  constructor(
    private caseStudyService: CaseStudyService,
    private logService: LogService,
    private userService: UserService,
  ) { 
    this.getUsers();
  }

  ngOnInit(): void {
  }

  showContent(e: any) {
    let contentContainer = e.srcElement.parentNode.parentNode.parentNode.querySelector('.report-container');
    console.log('showContent', contentContainer);
    if (contentContainer.classList.contains('hidden')) {
      contentContainer.classList.remove('hidden');
    } else {
      contentContainer.classList.add('hidden');
    }
  }

  getCaseStudy() {
    this.caseStudyService.getCaseStudyInfo(this.caseStudyId+'').subscribe({
      next: (res) => {
        if (res.isValid) {
          this.header = `Lịch sử ca khám ${res.jsonData.patientsName} - ${res.jsonData.createdTime}`;
        }
      }
    });
  }

  getCaseStudyHistory() {
    this.logs = []
    this.logService.getCaseStudyHistory(this.caseStudyId+'').subscribe({
      next: (res) => {
        if (res.isValid) {
          res.jsonData.forEach((d:any) => {
            this.logs.push({...d, fullname: this.users[d['username']]});
          });
        }
      }
    });
  }

  getUsers() {
    let payload = {
      take: 1000,
      skip: 0,
      keyword: ''
    };
    this.userService.getUsers(payload).subscribe({
      next: (res) => {
        if (res.isValid) {
          res.jsonData.data.forEach((d:any) => {
            if (d['fullname'] && d['fullname'] != '') {
              this.users[d['username']] = d['fullname'];
            } else {
              this.users[d['username']] = d['username'];
            }
          });
        }
      }
    });
  }
}
