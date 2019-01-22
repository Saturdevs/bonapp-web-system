import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowsEditComponent } from './cash-flows-edit.component';

describe('CashFlowsEditComponent', () => {
  let component: CashFlowsEditComponent;
  let fixture: ComponentFixture<CashFlowsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashFlowsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashFlowsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
