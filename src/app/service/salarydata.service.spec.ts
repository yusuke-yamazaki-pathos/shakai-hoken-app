import { TestBed } from '@angular/core/testing';

import { SalarydataService } from './salarydata.service';

describe('SalarydataService', () => {
  let service: SalarydataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalarydataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
