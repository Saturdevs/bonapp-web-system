import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowsNewComponent } from './cash-flows-new.component';

describe('CashFlowsNewComponent', () => {
  let component: CashFlowsNewComponent;
  let fixture: ComponentFixture<CashFlowsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashFlowsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashFlowsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
