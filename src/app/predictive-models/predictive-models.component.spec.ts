import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveModelsComponent } from './predictive-models.component';

describe('PredictiveModelsComponent', () => {
  let component: PredictiveModelsComponent;
  let fixture: ComponentFixture<PredictiveModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictiveModelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictiveModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
