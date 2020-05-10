import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolesNewComponent } from './user-roles-new.component';

describe('UserRolesNewComponent', () => {
  let component: UserRolesNewComponent;
  let fixture: ComponentFixture<UserRolesNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRolesNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
