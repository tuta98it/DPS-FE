import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'genderText',
})
export class GenderToTextPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}
  transform(genderNum: any): string {
    switch (genderNum) {
      case 0:
        return 'Nữ';
      case 1:
        return 'Nam';
      case 2:
        return 'Không xác định';
      default:
        return '';
    }
  }
}
