import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockControlModifyComponent } from './stock-control-modify.component';

describe('StockControlModifyComponent', () => {
  let component: StockControlModifyComponent;
  let fixture: ComponentFixture<StockControlModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockControlModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockControlModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
