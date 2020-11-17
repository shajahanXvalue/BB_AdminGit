import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BereavementComponent } from './bereavement.component';

describe('BereavementComponent', () => {
  let component: BereavementComponent;
  let fixture: ComponentFixture<BereavementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BereavementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BereavementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
