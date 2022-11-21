import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {
  @Input() caseStudyId = '';

  constructor() { }

  ngOnInit(): void {
  }

}
