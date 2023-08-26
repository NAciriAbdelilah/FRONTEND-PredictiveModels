import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePmScopeCanalsFrequencyComponent } from './update-pm-scope-canals-frequency.component';

describe('UpdatePmScopeCanalsFrequencyComponent', () => {
  let component: UpdatePmScopeCanalsFrequencyComponent;
  let fixture: ComponentFixture<UpdatePmScopeCanalsFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePmScopeCanalsFrequencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePmScopeCanalsFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
