import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveSchoolComponent } from './approve-school.component';

describe('ApproveSchoolComponent', () => {
  let component: ApproveSchoolComponent;
  let fixture: ComponentFixture<ApproveSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
