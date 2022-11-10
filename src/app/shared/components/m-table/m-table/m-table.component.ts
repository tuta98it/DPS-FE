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
  @Input() loading = false;
  @Input() isLazyLoad = false; // server-side pagination
  @Input() take = 20;
  @Output() onEditItem = new EventEmitter<any>();
  @Output() onDeleteItem = new EventEmitter<any>();
  @Output() selectRow = new EventEmitter<any>();
  @Output() onPageChange = new EventEmitter<any>();

  selectedItem = {};
  constructor() { }

  ngOnInit(): void {
  }

}
