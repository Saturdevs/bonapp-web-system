import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyMenuListComponent } from './daily-menu-list.component';

describe('DailyMenuListComponent', () => {
  let component: DailyMenuListComponent;
  let fixture: ComponentFixture<DailyMenuListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyMenuListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyMenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
