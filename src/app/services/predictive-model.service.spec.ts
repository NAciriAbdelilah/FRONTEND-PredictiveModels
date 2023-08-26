import { TestBed } from '@angular/core/testing';

import { PredictiveModelService } from './predictive-model.service';

describe('PredictiveModelService', () => {
  let service: PredictiveModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredictiveModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
