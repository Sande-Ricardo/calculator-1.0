import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MolarMassCalculatorComponent } from './molar-mass-calculator.component';

describe('MolarMassCalculatorComponent', () => {
  let component: MolarMassCalculatorComponent;
  let fixture: ComponentFixture<MolarMassCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MolarMassCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MolarMassCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
