import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { AdminMenuComponent } from './admin.menu.component';
import { AdminMenuitemComponent } from './admin.menuitem.component';
import { RouterModule } from '@angular/router';
import { AdminTopBarComponent } from './admin.topbar.component';
import { AdminSidebarComponent } from "./admin.sidebar.component";
import { AdminLayoutComponent } from "./admin.layout.component";
import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AdminMenuitemComponent,
    AdminTopBarComponent,
    AdminMenuComponent,
    AdminSidebarComponent,
    AdminLayoutComponent,
  ],
  imports: [
    // BrowserModule,
    // BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    RouterModule,
    AdminLayoutRoutingModule
  ],
  exports: [AdminLayoutComponent]
})
export class AdminLayoutModule { }
