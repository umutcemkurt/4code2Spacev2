/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LovService } from './lov.service';

describe('Service: Lov', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LovService]
    });
  });

  it('should ...', inject([LovService], (service: LovService) => {
    expect(service).toBeTruthy();
  }));
});
