import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
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
  protected _authSubscription: Subscription;
  currentUser = INIT_AUTH_MODEL;

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
    this._authSubscription = this.authState.subscribe( (m: IAuthModel) => {
      this.currentUser = m;
    });
  }
  
  signOut() {
    localStorage.removeItem(StorageKeys.TOKEN);
    localStorage.removeItem(StorageKeys.USER);
    this.authState.dispatch(null);
    this.router.navigate(['/login']);
  }

  public ngOnDestroy(): void {
    this._authSubscription.unsubscribe();
  }
}
