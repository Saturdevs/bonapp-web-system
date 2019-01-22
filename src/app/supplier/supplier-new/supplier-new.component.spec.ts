import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierNewComponent } from './supplier-new.component';

describe('SupplierNewComponent', () => {
  let component: SupplierNewComponent;
  let fixture: ComponentFixture<SupplierNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
