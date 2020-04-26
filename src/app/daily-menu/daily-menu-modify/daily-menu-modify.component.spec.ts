import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyMenuModifyComponent } from './daily-menu-modify.component';

describe('DailyMenuModifyComponent', () => {
  let component: DailyMenuModifyComponent;
  let fixture: ComponentFixture<DailyMenuModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyMenuModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyMenuModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
