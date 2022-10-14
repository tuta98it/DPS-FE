import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Hệ thống',
                icon: 'pi pi-fw pi-briefcase',
                // routerLink: ['/users'],
                items: [
                    {
                        label: 'Quản lý user',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Danh sách user',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/users']
                            },
                            {
                                label: 'Xem phân quyền user',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['#']
                            },
                            {
                                label: 'Danh sách user group',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/users/user-groups']
                            },
                            {
                                label: 'Xem phân quyền user group',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['#']
                            },
                        ]
                    },
                    {
                        label: 'CRUD',
                        icon: 'pi pi-fw pi-briefcase',
                        routerLink: ['/crud'],
                    },
                ]
            },
        ];
    }
}
