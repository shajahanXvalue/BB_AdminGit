import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveVendorsComponent } from './active-vendors.component';

describe('ActiveVendorsComponent', () => {
  let component: ActiveVendorsComponent;
  let fixture: ComponentFixture<ActiveVendorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveVendorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
