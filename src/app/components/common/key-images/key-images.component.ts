import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { KeyImageService } from 'src/app/services/key-image.service';
import { AppConfigService } from 'src/app/shared/app-config.service';

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
    if (this.caseStudyId != '' && value) {
      this.getKeyImages();
      this.getPrintedKeyImages();
    }
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

  _caseStudyId = new String('');
  @Input() set caseStudyId(data: String) {
    this._caseStudyId = data;
  }
  get caseStudyId() {
    return this._caseStudyId;
  }
  FILE_URL = '';
  isNoImage = false;

  constructor(
    private caseStudyService: CaseStudyService,
    private keyImageService: KeyImageService,
    public configService: AppConfigService,
  ) { 
    this.setImageSize();
    this.FILE_URL = this.configService.getConfig().api.fileUrl;
  }

  ngOnInit(): void {
  }

  setImageSize() {
    this.imgWidth = window.innerWidth*0.5 + 'px';
    this.imgHeight = window.innerHeight*0.75 + 'px';
  }

  changePrinted(index: number) {
    if (this.printedKeyImages.indexOf(this.images[index].id) > -1) {
      if (this.caseStudyId != '') {
        this.removePrinted(this.images[index].id);
      } else {
        this.removePrintedKeyImage.emit(this.images[index].id);
      }
    } else {
      if (this.caseStudyId != '') {
        this.addPrinted(this.images[index].id);
      } else {
        this.addPrintedKeyImage.emit(this.images[index].id);
      }
    }
  }

  getPrintedKeyImages() {
    this.caseStudyService.getById(this.caseStudyId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.printedKeyImages = res.jsonData.printKeyImages ?? [];
        }
      }
    });
  }
  
  getKeyImages() {
    this.keyImageService.getCaseStudyKeyImages(this.caseStudyId+'').subscribe({
      next: (res) => {
        if (res.isValid) {
          res.jsonData.forEach((i:any) => {
            i.src = `${this.FILE_URL}/${i.imagePath}`;
          });
          this.images = res.jsonData;
          this.isNoImage = this.images.length == 0;
          if (this.isNoImage) {
            this.images.push({src: 'assets/images/no-images.PNG'});
          }
        }
      }
    });
  }

  removePrinted(id: string) {
    let i = this.printedKeyImages.indexOf(id);
    if (i > -1) {
      this.printedKeyImages.splice(i, 1);
      this.savePrintedKeyImages();
    }
  }

  addPrinted(id: string) {
    if (this.printedKeyImages.indexOf(id)==-1) {
      this.printedKeyImages.push(id);
      this.savePrintedKeyImages();
    }
  }

  savePrintedKeyImages() {
    let payload = {
      caseStudyId: this.caseStudyId,
      keyImageIds: this.printedKeyImages
    };
    this.caseStudyService.savePrintedKeyImages(payload).subscribe({
      next: (res) => {
      }
    });
  }
}
