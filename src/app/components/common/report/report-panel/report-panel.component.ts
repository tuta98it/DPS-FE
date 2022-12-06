import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'report-panel',
  templateUrl: './report-panel.component.html',
  styleUrls: ['./report-panel.component.scss']
})
export class ReportPanelComponent implements OnInit {
  @Input() caseStudy: any = {};

  isPrintPreviewVisible:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  printPreview(event:any): void {
    this.isPrintPreviewVisible = true;
  }
}
