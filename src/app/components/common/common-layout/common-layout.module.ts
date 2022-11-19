import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonLayoutComponent } from './common-layout/common-layout.component';
import { RouterModule } from '@angular/router';
import { CommonLayoutRoutingModule } from './common-layout-routing.module';
import { HeaderComponent } from './header/header.component';
import { WorklistModule } from '../worklist/worklist.module';
import { ViewerModule } from '../viewer/viewer.module';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SplitterModule } from 'primeng/splitter';
import { NotificationModule } from '../../notification/notification.module';

@NgModule({
  declarations: [
    CommonLayoutComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    TieredMenuModule,
    DialogModule,
    ButtonModule,
    SplitterModule,
    RippleModule,
    WorklistModule,
    ViewerModule,
    RouterModule,
    CommonLayoutRoutingModule,
    NotificationModule
  ]
})
export class CommonLayoutModule { }
