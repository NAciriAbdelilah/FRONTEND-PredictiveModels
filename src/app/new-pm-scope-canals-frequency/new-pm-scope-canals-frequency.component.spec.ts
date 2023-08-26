import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPmScopeCanalsFrequencyComponent } from './new-pm-scope-canals-frequency.component';

describe('NewPmScopeCanalsFrequencyComponent', () => {
  let component: NewPmScopeCanalsFrequencyComponent;
  let fixture: ComponentFixture<NewPmScopeCanalsFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPmScopeCanalsFrequencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPmScopeCanalsFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
