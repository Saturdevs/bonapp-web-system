/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MenuModifyComponent } from './menu-modify.component';

describe('MenuModifyComponent', () => {
  let component: MenuModifyComponent;
  let fixture: ComponentFixture<MenuModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
