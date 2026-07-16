import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdeComponent } from './ode.component';

describe('OdeComponent', () => {
  let component: OdeComponent;
  let fixture: ComponentFixture<OdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
