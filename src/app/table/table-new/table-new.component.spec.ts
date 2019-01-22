import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableNewComponent } from './table-new.component';

describe('TableNewComponent', () => {
  let component: TableNewComponent;
  let fixture: ComponentFixture<TableNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
