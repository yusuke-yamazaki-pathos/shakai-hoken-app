import { TestBed } from '@angular/core/testing';

import { CalculateShakaihokenService } from './calculate-shakaihoken.service';

describe('CalculateShakaihokenService', () => {
  let service: CalculateShakaihokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculateShakaihokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
