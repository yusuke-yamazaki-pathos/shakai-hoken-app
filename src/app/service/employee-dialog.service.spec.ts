import { TestBed } from '@angular/core/testing';

import { EmployeeDialogService } from './employee-dialog.service';

describe('EmployeeDialogService', () => {
  let service: EmployeeDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
