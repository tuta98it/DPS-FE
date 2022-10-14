import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastMessage',
})
export class LastMessageTimePipe implements PipeTransform {
  transform(value: any): any {
    const date = value.split('/');
    const newDate = new Date(date[1] + '/' + date[0] + '/' + date[2]); //convert dd/MM/yyyy to MM/dd/yyyy
    const currentTime = new Date();
    const diff = (currentTime.getTime() - newDate.getTime()) / (1000 * 60); //trả về phút
    if (diff < 60) {
      return (diff.toFixed() === '0' ? '1' : diff.toFixed()) + ' phút';
    } else if (diff >= 60 && diff < 1440) {
      return (diff / 60).toFixed() + ' giờ';
    } else if (diff >= 1440 && diff < 1440 * 7) {
      //ngày < tuần
      return (diff / (60 * 24)).toFixed() + ' ngày';
    } else if (diff >= 1440 * 7 && diff / (1440 * 7) < 52) {
      //tuần < 52 tuần = 1 năm
      return (diff / (1440 * 7)).toFixed() + ' tuần';
    } else if (diff / (1440 * 7) >= 52) {
      //năm
      return (diff / (1440 * 7 * 52)).toFixed() + ' năm';
    } else {return null;}
  }
}
