import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditPinComponent } from './user-edit-pin.component';

describe('UserEditPinComponent', () => {
  let component: UserEditPinComponent;
  let fixture: ComponentFixture<UserEditPinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEditPinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
