import { TestBed } from '@angular/core/testing';

import { CanalsService } from './canals.service';

describe('CanalsService', () => {
  let service: CanalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
