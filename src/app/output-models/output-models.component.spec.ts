import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputModelsComponent } from './output-models.component';

describe('OutputModelsComponent', () => {
  let component: OutputModelsComponent;
  let fixture: ComponentFixture<OutputModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputModelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
