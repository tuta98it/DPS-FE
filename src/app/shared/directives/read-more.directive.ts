import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
} from '@angular/core';
declare let $: any;

const hideConfig = {
  height: '135px',
  overFlowType: 'hidden',
  buttonText: '[xem thêm...]',
};
const showConfig = {
  height: 'max-content',
  overFlowType: 'visible',
  buttonText: '[thu gọn]',
};
@Directive({
  selector: '[read-more]',
})
export class ReadMoreDirective implements OnInit {
  readMore = false;
  constructor(private el: ElementRef, private _renderer: Renderer2) {}

  ngOnInit() {
    setTimeout(() => {
      if (this.el.nativeElement.offsetHeight > 150 && !this.readMore) {
        this.render(hideConfig);
      }
    }, 50);
  }

  readMoreButtonclicked() {
    this.readMore = !this.readMore;
    const removableChild = $(this.el.nativeElement.parentNode).find(
      '.read-more'
    )[0];
    if (removableChild) {
      this.el.nativeElement.parentNode.removeChild(removableChild);
    }
    this.readMore ? this.render(showConfig) : this.render(hideConfig);
  }

  render({ height, overFlowType, buttonText }: any) {
    this.el.nativeElement.style.height = height;
    this.el.nativeElement.style.overflow = overFlowType;
    const wrapperEl = this._renderer.createElement('div');
    const buttonEl = this._renderer.createElement('span');
    const text = this._renderer.createText(buttonText);
    this._renderer.appendChild(buttonEl, text);
    this._renderer.listen(buttonEl, 'click', () => {
      this.readMoreButtonclicked();
    });
    if (buttonText == hideConfig.buttonText) {
      this._renderer.addClass(wrapperEl, 'show');
    }
    this._renderer.addClass(wrapperEl, 'read-more');

    wrapperEl.appendChild(buttonEl, text);
    this._renderer.appendChild(this.el.nativeElement.parentNode, wrapperEl);
  }
}
