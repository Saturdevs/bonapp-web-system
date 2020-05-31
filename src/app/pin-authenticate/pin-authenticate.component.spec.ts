import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinAuthenticateComponent } from './pin-authenticate.component';

describe('PinAuthenticateComponent', () => {
  let component: PinAuthenticateComponent;
  let fixture: ComponentFixture<PinAuthenticateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinAuthenticateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinAuthenticateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
