import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { Roles } from 'src/app/shared/constants/constants';

@Component({
  selector: 'admin-menu',
  templateUrl: './admin.menu.component.html'
})
export class AdminMenuComponent implements OnInit {
  protected _authSubscription: Subscription;
  currentUser = INIT_AUTH_MODEL;

  model: any[] = [];

  constructor(
    private authState: AuthStateService,
  ) {
    this._authSubscription = this.authState.subscribe( (m: IAuthModel) => {
      this.currentUser = m;
    });
  }

  ngOnInit() {
    this.model = [
      {
        label: 'Quản lý hệ thống',
        icon: 'pi pi-fw pi-briefcase',
        items: [
          {
            label: 'Quản lý user',
            icon: 'pi pi-fw pi-user',
            visible: this.currentUser.userTypes?.includes(Roles.MANGAGE_USER),
            items: [
              {
                label: 'Danh sách user',
                icon: 'pi pi-fw pi-user',
                routerLink: ['/admin/users'],
              },
              {
                label: 'Xem phân quyền user',
                icon: 'pi pi-fw pi-user',
                routerLink: ['/admin/user-roles']
              },
            ]
          },
          {
            label: 'Quản lý group',
            icon: 'pi pi-fw pi-users',
            visible: this.currentUser.userTypes?.includes(Roles.MANGAGE_GROUP),
            items: [
              {
                label: 'Danh sách group',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/admin/user-groups']
              },
              {
                label: 'Phân quyền group',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/admin/group-roles']
              },
            ]
          },
          {
            label: 'Báo cáo - Mẫu in',
            icon: 'pi pi-fw pi-print',
            visible: this.currentUser.userTypes?.includes(Roles.MANAGE_TEMPLATE),
            items: [
              {
                label: 'Quản lý mẫu in',
                icon: 'pi pi-fw pi-print',
                routerLink: ['/admin/print-templates']
              },
              {
                label: 'Quản lý mẫu báo cáo',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/admin/report-templates']
              },
            ]
          },
          {
            label: 'Quản lý danh mục',
            icon: 'pi pi-fw pi-align-justify',
            visible: this.currentUser.userTypes?.includes(Roles.MANAGE_MARKTYPE),
            items: [
              {
                label: 'BS chỉ định',
                icon: 'pi pi-fw pi-user',
                routerLink: ['/admin/order-doctor'],
              },
              {
                label: 'Phương pháp nhuộm',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/admin/mark-types'],
              },
              {
                label: 'KTV xử lí mẫu',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/admin/sample-processing'],
              },
              {
                label: 'Danh mục nơi gửi mẫu',
                icon: 'pi pi-fw pi-align-justify',
                routerLink: ['/admin/source-hospital'],
              }
            ]
          },
        ]
      },
    ];
  }

  public ngOnDestroy(): void {
    this._authSubscription.unsubscribe();
  }
}
