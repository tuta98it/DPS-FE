import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'report-actions',
  templateUrl: './report-actions.component.html',
  styleUrls: ['./report-actions.component.scss']
})
export class ReportActionsComponent implements OnInit {
  REPORT_ACTIONS = Constants.REPORT_ACTIONS;
  @Output() onAction = new EventEmitter<any>();
  @Input() report: any = {};
  @Input() disableEditor = true;
  @Input() disableActions = true;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  emitAction(action: any) {
    this.onAction.emit(
      { action: action }
    );
  }
}
