import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPmFeaturesComponent } from './new-pm-features.component';

describe('NewPmFeaturesComponent', () => {
  let component: NewPmFeaturesComponent;
  let fixture: ComponentFixture<NewPmFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPmFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPmFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
