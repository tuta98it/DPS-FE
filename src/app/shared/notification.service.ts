import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private messageService: MessageService
  ) {}
  success(summary: string, detail: string = '') {
    this.messageService.add({severity: 'success', summary: summary, detail: detail});
  }
  warn(summary: string, detail: string = '') {
    this.messageService.add({severity: 'warn', summary: summary, detail: detail});
  }
  error(summary: string, detail: string = '') {
    this.messageService.add({severity: 'error', summary: summary, detail: detail});
  }
}