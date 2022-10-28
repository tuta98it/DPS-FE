import {
  Directive,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';

function getWindow(): any {
  return window;
}

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective {
  constructor(private elementRef: ElementRef) {}
  @Output()
  public clickOutside = new EventEmitter<any>();

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit(targetElement.id);
    }
  }
}
