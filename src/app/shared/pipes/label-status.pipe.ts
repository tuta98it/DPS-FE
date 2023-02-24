import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'labelStatus',
})
export class LabelStatusPipe implements PipeTransform {
    constructor(protected sanitizer: DomSanitizer) {}

    transform(data: any, includeIcon?: boolean): any {
        let label = '';
        switch (data) {
            case 0:
                label = 'Chưa gán nhãn';
                break;
            case 1:
                label = 'Đã gán nhãn';
                break;
            case 2:
                label = 'Đã gán nhãn 1';
                break;
            case 3:
                label = 'Đã gán nhãn 2';
                break;
            case 4:
                label = 'Không duyệt nhãn';
                break;
            case 5:
                label = 'Đã duyệt nhãn';
                break;
            default:
                label = '';
                break;
        }
        if (includeIcon) {
            const iconUrl = this.getIconUrl(data);
            const iconHtml = `<img src="${iconUrl}" alt="Label Status Icon" width="16" height="16">`;
            label = `${iconHtml} ${label}`;
        }
        const labelHtml = this.sanitizer.bypassSecurityTrustHtml(label);
        return labelHtml;
    }

    getIconUrl(data: any): string {
        let iconUrl = '';
        switch (data) {
            case 0:
                iconUrl = '/assets/icons/not_assigned.svg';
                break;
            case 1:
                iconUrl = '/assets/icons/assigned.svg';
                break;
            case 2:
                iconUrl = '/assets/icons/assigned_1.svg';
                break;
            case 3:
                iconUrl = '/assets/icons/assigned_2.svg';
                break;
            case 4:
                iconUrl = '/assets/icons/not_approved.svg';
                break;
            case 5:
                iconUrl = '/assets/icons/approved.svg';
                break;
            default:
                iconUrl = '';
                break;
        }
        return iconUrl;
    }
}
