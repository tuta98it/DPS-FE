import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Constants, Roles } from 'src/app/shared/constants/constants';

@Component({
  selector: 'report-actions',
  templateUrl: './report-actions.component.html',
  styleUrls: ['./report-actions.component.scss']
})
export class ReportActionsComponent implements OnInit {
  REPORT_ACTIONS = Constants.REPORT_ACTIONS;
  doctors: any[] = [];
  @Output() onAction = new EventEmitter<any>();
  @Input() report: any = {};
  @Input() disableEditor = true;
  @Input() disableActions = true;

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getDoctors();
  }

  emitAction(action: any) {
    this.onAction.emit(
      { action: action }
    );
  }

  getDoctors() {
    let payload = {
      take: 1000,
      skip: 0,
      keyword: ''
    };
    this.userService.getUserRoles(payload).subscribe({
      next: (res) => {
        if (res.isValid) {
          res.jsonData.data.forEach((d:any) => {
            if (d.roles && d.roles.includes(Roles.DOCTOR_READ)) {
              this.doctors.push({
                username: d.username,
                fullname: d.fullname,
                id: d.id
              });
            }
          });
        }
      }
    });
  }
}
