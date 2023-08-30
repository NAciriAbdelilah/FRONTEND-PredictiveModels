import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartDrComponent } from './pie-chart-dr.component';

describe('ChartComponent', () => {
  let component: PieChartDrComponent;
  let fixture: ComponentFixture<PieChartDrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieChartDrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartDrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
