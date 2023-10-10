import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartSegmentComponent } from './pie-chart-segment.component';

describe('PieChartSegmentComponent', () => {
  let component: PieChartSegmentComponent;
  let fixture: ComponentFixture<PieChartSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieChartSegmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
