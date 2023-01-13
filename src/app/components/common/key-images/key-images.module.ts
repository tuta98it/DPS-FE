import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyImagesComponent } from './key-images.component';
import { GalleriaModule } from 'primeng/galleria';
import { BadgeModule } from 'primeng/badge';


@NgModule({
  declarations: [
    KeyImagesComponent
  ],
  imports: [
    CommonModule,
    BadgeModule,
    GalleriaModule
  ],
  exports: [
    KeyImagesComponent
  ]
})
export class KeyImagesModule { }
