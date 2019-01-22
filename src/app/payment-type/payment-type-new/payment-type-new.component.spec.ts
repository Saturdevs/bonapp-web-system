import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeNewComponent } from './payment-type-new.component';

describe('PaymentTypeNewComponent', () => {
  let component: PaymentTypeNewComponent;
  let fixture: ComponentFixture<PaymentTypeNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTypeNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTypeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
