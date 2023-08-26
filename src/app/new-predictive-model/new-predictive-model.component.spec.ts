import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPredictiveModelComponent } from './new-predictive-model.component';

describe('NewPredictiveModelComponent', () => {
  let component: NewPredictiveModelComponent;
  let fixture: ComponentFixture<NewPredictiveModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPredictiveModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPredictiveModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
