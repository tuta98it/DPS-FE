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
  
  @Output() removePrintedKeyImage = new EventEmitter<any>();
  @Output() addPrintedKeyImage = new EventEmitter<any>();

  isSmallScreen = true;
  @Input() activeIndex = 0;
  imgWidth = '960px';
  imgHeight = '720px';
  
  @Input() printedKeyImages: any[] = [];

  constructor() { 
    this.setImageSize();
  }

  ngOnInit(): void {
  }

  setImageSize() {
    this.imgWidth = window.innerWidth*0.5 + 'px';
    this.imgHeight = window.innerHeight*0.75 + 'px';
  }

  changePrinted(index: number) {
    if (this.printedKeyImages.indexOf(this.images[index].id) > -1) {
      this.removePrintedKeyImage.emit(this.images[index].id);
    } else {
      this.addPrintedKeyImage.emit(this.images[index].id);
    }
  }
}
