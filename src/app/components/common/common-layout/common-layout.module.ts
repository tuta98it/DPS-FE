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
import { NotificationModule } from '../../../shared/components/notification/notification.module';
import { VTWorklistModule } from '../vt-worklist/vt-worklist.module';
import { AngularSplitModule } from 'angular-split';
import { NotificationPanelComponent } from './notification-panel/notification-panel.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ClickStopPropagationDirective } from 'src/app/shared/directives/click-stop-propagation.directive';
import { ClickOutsideDirective } from 'src/app/shared/directives/click-outside.directive';
import { ProgressBarModule } from 'primeng/progressbar';
import { ShareStudyComponent } from '../share-study/share-study.component';

@NgModule({
  declarations: [
    CommonLayoutComponent,
    HeaderComponent,
    NotificationPanelComponent,
    ClickStopPropagationDirective,
    ClickOutsideDirective,
    ShareStudyComponent
  ],
  imports: [
    CommonModule,
    TieredMenuModule,
    DialogModule,
    AngularSplitModule,
    ButtonModule,
    SplitterModule,
    RippleModule,
    ProgressBarModule,
    OverlayPanelModule,
    WorklistModule,
    VTWorklistModule,
    ViewerModule,
    RouterModule,
    CommonLayoutRoutingModule,
    NotificationModule
  ]
})
export class CommonLayoutModule { }
