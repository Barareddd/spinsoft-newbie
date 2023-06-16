import { TestBed } from '@angular/core/testing';

import { BackendDdcCareService } from './backend-ddc-care.service';

describe('BackendDdcCareService', () => {
  let service: BackendDdcCareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendDdcCareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
