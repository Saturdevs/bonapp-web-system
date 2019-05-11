import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCloseComponent } from './order-close.component';

describe('OrderCloseComponent', () => {
  let component: OrderCloseComponent;
  let fixture: ComponentFixture<OrderCloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
