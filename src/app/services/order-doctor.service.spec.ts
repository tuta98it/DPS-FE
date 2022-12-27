/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OrderDoctorService } from './order-doctor.service';

describe('Service: OrderDoctor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderDoctorService]
    });
  });

  it('should ...', inject([OrderDoctorService], (service: OrderDoctorService) => {
    expect(service).toBeTruthy();
  }));
});
