import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartMarcheComponent } from './pie-chart-marche.component';

describe('PieChartMarcheComponent', () => {
  let component: PieChartMarcheComponent;
  let fixture: ComponentFixture<PieChartMarcheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieChartMarcheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartMarcheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
