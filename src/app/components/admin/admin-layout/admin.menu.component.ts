import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'admin-menu',
    templateUrl: './admin.menu.component.html'
})
export class AdminMenuComponent implements OnInit {

    model: any[] = [];

    constructor() { }

    ngOnInit() {
        this.model = [
            {
                label: 'Quản lý hệ thống',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Quản lý user',
                        icon: 'pi pi-fw pi-user',
                        visible: true,
                        items: [
                            {
                                label: 'Danh sách user',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/admin/users']
                            },
                            {
                                label: 'Xem phân quyền user',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/admin/crud']
                            },
                        ]
                    },
                    {
                        label: 'Quản lý user group',
                        icon: 'pi pi-fw pi-users',
                        visible: true,
                        items: [
                            {
                                label: 'Danh sách user group',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/admin/user-groups']
                            },
                            {
                                label: 'Xem phân quyền user group',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/admin/crud']
                            },
                        ]
                    },
                    {
                        label: 'CRUD',
                        icon: 'pi pi-fw pi-briefcase',
                        routerLink: ['/admin/crud'],
                    },
                ]
            },
        ];
    }
}
