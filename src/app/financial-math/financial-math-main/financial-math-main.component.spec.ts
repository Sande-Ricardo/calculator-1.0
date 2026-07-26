import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialMathMainComponent } from './financial-math-main.component';

describe('FinancialMathMainComponent', () => {
  let component: FinancialMathMainComponent;
  let fixture: ComponentFixture<FinancialMathMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialMathMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialMathMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
