import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyImagesComponent } from './key-images.component';
import { GalleriaModule } from 'primeng/galleria';


@NgModule({
  declarations: [
    KeyImagesComponent
  ],
  imports: [
    CommonModule,
    GalleriaModule
  ],
  exports: [
    KeyImagesComponent
  ]
})
export class KeyImagesModule { }
