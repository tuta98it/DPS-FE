import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private messageService: MessageService
  ) {}
  success(summary: string, detail: string = '', key='default') {
    this.messageService.add({severity: 'success', summary: summary, detail: detail, key: key,});
  }
  warn(summary: string, detail: string = '', key='default') {
    this.messageService.add({severity: 'warn', summary: summary, detail: detail, key: key,});
  }
  error(summary: string, detail: string = '', key='default') {
    this.messageService.add({severity: 'error', summary: summary, detail: detail, key: key,});
  }
  add(type: string, summary: string, detail: string = '', key='default', sticky=false) {
    this.messageService.add({key: key, severity: type, summary: summary, detail: detail, sticky: sticky});
  }
  firebase(summary: string, detail: string = '') {
    this.messageService.add({summary: summary, detail: detail, key: 'firebase', severity: 'info', sticky: false, life: 10000});
  }
}