import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class AnnotationService extends BaseService {
  override url = '/Annotation';

  getListAnnotationOfCaseStudy(studyId: string) {
    return this.get(`${this.url}/CaseStudy/${studyId}`);
  }
  getListAnnotationOfSlide(slideId: string) {
    return this.get(`${this.url}/Slide/${slideId}`);
  }
  saveAnnotationsBySlide(data: any) {
    return this.post(`${this.url}/UpdateBySlide`, data);
  }

  //for shared token
  getListAnnotationOfSlideByToken(slideId: string, sharedToken: string) {
    return this.get(`${this.url}/GetByToken?id=${slideId}&token=${sharedToken}`);
  }
}
