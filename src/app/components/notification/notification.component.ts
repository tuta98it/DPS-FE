import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
    constructor(
        private messageService: MessageService,
        private primengConfig: PrimeNGConfig
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
    }

    showConfirm(message: any) {
        console.log(message);
        let data = message.data;
        this.messageService.add({
            key: 'c',
            sticky: true,
            severity: 'info',
            summary: data.title,
            detail: data.message,
        });
    }
}
