import {
  Directive,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appMouseMiddleClick]',
})
export class MouseMiddleClickDirective {
  @Output() callbackFunction: EventEmitter<any> = new EventEmitter();
  constructor() {}

  @HostListener('mouseup', ['$event']) onClick($event: any) {
    if ($event.which === 2) {this.callbackFunction.emit();}
  }
}
