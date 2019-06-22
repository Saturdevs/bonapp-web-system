import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTemplateComponent } from './cancel-template.component';

describe('CancelTemplateComponent', () => {
  let component: CancelTemplateComponent;
  let fixture: ComponentFixture<CancelTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
