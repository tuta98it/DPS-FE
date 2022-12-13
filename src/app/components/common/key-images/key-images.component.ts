import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'key-images',
  templateUrl: './key-images.component.html',
  styleUrls: ['./key-images.component.scss']
})
export class KeyImagesComponent implements OnInit {
  @Input() images: any[] = [];
  responsiveOptions: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5
    },
    {
      breakpoint: '1024px',
      numVisible: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();

  isSmallScreen = true;
  imgWidth = '960px';
  imgHeight = '720px';

  constructor() { 
    this.isSmallScreen = window.innerWidth < 1600;
    this.setImageSize();
  }

  ngOnInit(): void {
  }

  setImageSize() {
    if (this.isSmallScreen) {
      this.imgWidth = '720px';
      this.imgHeight = '480px';
    }
  }
}
