import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterEditComponent } from './cash-register-edit.component';

describe('CashRegisterEditComponent', () => {
  let component: CashRegisterEditComponent;
  let fixture: ComponentFixture<CashRegisterEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
