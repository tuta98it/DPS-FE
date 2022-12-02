import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss']
})
export class NotificationPanelComponent implements OnInit {
  uploadingList: any[] = [];
  processingList: any[] = [];
  completedList: any[] = [];

  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();

  @Input() isClickOutside = true;
  
  constructor(
    private _elementRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  onClickOutside(event: any) {
    if (this.visible && this.isClickOutside) {
      this.visible = false;
    }
    this.isClickOutside = true;
  }
}
