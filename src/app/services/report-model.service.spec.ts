import { TestBed } from '@angular/core/testing';

import { ReportModelService } from './report-model.service';

describe('ReportModelService', () => {
  let service: ReportModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
