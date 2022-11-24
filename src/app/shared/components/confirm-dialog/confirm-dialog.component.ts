import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  
  @Input() visible = false;
  @Input() confirmText = '';
  @Input() confirmLabel = 'Xóa';
  @Output() visibleChange = new EventEmitter<any>();
  @Output() onConfirm = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}
