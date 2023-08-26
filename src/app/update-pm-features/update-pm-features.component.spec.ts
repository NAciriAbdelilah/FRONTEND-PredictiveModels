import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePmFeaturesComponent } from './update-pm-features.component';

describe('UpdatePmFeaturesComponent', () => {
  let component: UpdatePmFeaturesComponent;
  let fixture: ComponentFixture<UpdatePmFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePmFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePmFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
