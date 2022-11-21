import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerComponent } from './viewer.component';
import { ViewerTabsComponent } from './viewer-tabs/viewer-tabs.component';



@NgModule({
  declarations: [
    ViewerComponent,
    ViewerTabsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ViewerComponent,
    ViewerTabsComponent
  ]
})
export class ViewerModule { }
