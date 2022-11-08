import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'm-table',
  templateUrl: './m-table.component.html',
  styleUrls: ['./m-table.component.scss']
})
export class MTableComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() cols: any[] = [];
  @Input() totalRecords = 0;
  @Input() dataKey = '';
  @Input() take = 20;
  @Output() editItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() selectRow = new EventEmitter<any>();
  @Output() changePage = new EventEmitter<any>();

  selectedItem = {};
  constructor() { }

  ngOnInit(): void {
  }

}
