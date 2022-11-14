import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { StorageKeys } from 'src/app/shared/constants/constants';
import { AdminLayoutService } from "./service/admin.layout.service";

@Component({
  selector: 'admin-topbar',
  templateUrl: './admin.topbar.component.html'
})
export class AdminTopBarComponent {

  profileMenuItems!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: AdminLayoutService,
    private router: Router,
    private authState: AuthStateService,
  ) {
    this.profileMenuItems = [
      {
        label: 'Trang chủ',
        icon: 'pi pi-fw pi-home',
        routerLink: '/'
      },
      {
        separator: true
      },
      {
        label: 'Đăng xuất',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.signOut()
      }
    ];
  }
  signOut() {
    localStorage.removeItem(StorageKeys.TOKEN);
    localStorage.removeItem(StorageKeys.USER);
    this.authState.dispatch(null);
    this.router.navigate(['/login']);
  }
}
