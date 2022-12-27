/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SampleProcessingService } from './sample-processing.service';

describe('Service: SampleProcessing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SampleProcessingService]
    });
  });

  it('should ...', inject([SampleProcessingService], (service: SampleProcessingService) => {
    expect(service).toBeTruthy();
  }));
});
