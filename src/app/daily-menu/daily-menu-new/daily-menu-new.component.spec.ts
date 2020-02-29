import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyMenuNewComponent } from './daily-menu-new.component';

describe('DailyMenuNewComponent', () => {
  let component: DailyMenuNewComponent;
  let fixture: ComponentFixture<DailyMenuNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyMenuNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyMenuNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
