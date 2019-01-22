import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierModuleComponent } from './supplier-module.component';

describe('SupplierModuleComponent', () => {
  let component: SupplierModuleComponent;
  let fixture: ComponentFixture<SupplierModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
