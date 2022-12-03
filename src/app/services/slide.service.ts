import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class SlideService extends BaseService {
  override url = '/Slide';
  getSlideByUploader() {
    return this.get(`${this.url}/Uploader`);
  }
  markAsReadAll() {
    return this.get(`${this.url}/ReadAllSlide`);
  }
  markAsRead(id: string) {
    return this.put(`${this.url}/ReadSlide/${id}`, '');
  }
}
