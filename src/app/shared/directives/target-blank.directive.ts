import { Directive, ElementRef, HostListener, Input } from '@angular/core';

function getWindow(): any {
  return window;
}

@Directive({
  selector: '[appTargetBlank]',
})
export class TargetBlankDirective {
  @Input() routerLink = '';
  constructor(private el: ElementRef) {}
  @HostListener('mousedown') onMouseEnter() {
    getWindow().open(this.routerLink || 'main/default');
  }
}
