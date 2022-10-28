import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'm-table',
  templateUrl: './m-table.component.html',
  styleUrls: ['./m-table.component.scss']
})
export class MTableComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() cols: any[] = [];
  selectedItems = [];
  constructor() { }

  ngOnInit(): void {
  }

}
