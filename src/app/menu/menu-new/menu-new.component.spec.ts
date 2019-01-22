/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MenuNewComponent } from './menu-new.component';

describe('MenuNewComponent', () => {
  let component: MenuNewComponent;
  let fixture: ComponentFixture<MenuNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
