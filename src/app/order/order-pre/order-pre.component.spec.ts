import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreComponent } from './order-pre.component';

describe('OrderPreComponent', () => {
  let component: OrderPreComponent;
  let fixture: ComponentFixture<OrderPreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
