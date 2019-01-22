import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowsListComponent } from './cash-flows-list.component';

describe('CashFlowsListComponent', () => {
  let component: CashFlowsListComponent;
  let fixture: ComponentFixture<CashFlowsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashFlowsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashFlowsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
