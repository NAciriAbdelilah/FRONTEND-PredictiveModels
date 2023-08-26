import { TestBed } from '@angular/core/testing';

import { OutputModelService } from './output-model.service';

describe('OutputModelService', () => {
  let service: OutputModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutputModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
