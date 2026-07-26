import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialEngineService } from '../../services/financial-engine.service';

@Component({
  selector: 'app-project-evaluation',
  templateUrl: './project-evaluation.component.html',
  styleUrls: ['./project-evaluation.component.scss']
})
export class ProjectEvaluationComponent implements OnInit {

  form: FormGroup;
  npv: number | null = null;
  irr: number | null = null;

  constructor(
    private fb: FormBuilder,
    private engine: FinancialEngineService
  ) {
    this.form = this.fb.group({
      initialInvestment: [10000, [Validators.required, Validators.min(0)]],
      discountRate: [10, [Validators.required, Validators.min(0)]], // %
      cashFlows: this.fb.array([
        this.fb.control(2000, Validators.required),
        this.fb.control(3000, Validators.required),
        this.fb.control(4000, Validators.required),
        this.fb.control(5000, Validators.required)
      ])
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.evaluateProject();
    });
    this.evaluateProject();
  }

  get cashFlowsControls() {
    return (this.form.get('cashFlows') as FormArray).controls;
  }

  addCashFlow(): void {
    const cashFlows = this.form.get('cashFlows') as FormArray;
    cashFlows.push(this.fb.control(0, Validators.required));
  }

  removeCashFlow(index: number): void {
    const cashFlows = this.form.get('cashFlows') as FormArray;
    if (cashFlows.length > 1) {
      cashFlows.removeAt(index);
    }
  }

  evaluateProject(): void {
    if (this.form.invalid) {
      this.npv = null;
      this.irr = null;
      return;
    }

    const initialInvestment = Number(this.form.value.initialInvestment);
    const discountRate = Number(this.form.value.discountRate) / 100;
    const cashFlows = this.form.value.cashFlows.map((cf: any) => Number(cf));

    this.npv = this.engine.calculateNPV(initialInvestment, cashFlows, discountRate);
    this.irr = this.engine.calculateIRR(initialInvestment, cashFlows);
    
    if (isNaN(this.irr) || !isFinite(this.irr)) {
      this.irr = null; // No convergió
    } else {
      this.irr = this.irr * 100; // a porcentaje
    }
  }
}
