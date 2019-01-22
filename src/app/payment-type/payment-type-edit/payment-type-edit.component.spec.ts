import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeEditComponent } from './payment-type-edit.component';

describe('PaymentTypeEditComponent', () => {
  let component: PaymentTypeEditComponent;
  let fixture: ComponentFixture<PaymentTypeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTypeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
