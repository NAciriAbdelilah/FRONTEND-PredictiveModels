import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterByNameAndDateComponent } from './filter-by-name-and-date.component';

describe('FilterByNameAndDateComponent', () => {
  let component: FilterByNameAndDateComponent;
  let fixture: ComponentFixture<FilterByNameAndDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterByNameAndDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterByNameAndDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
