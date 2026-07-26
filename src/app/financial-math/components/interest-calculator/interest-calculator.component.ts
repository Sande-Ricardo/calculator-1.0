import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialEngineService } from '../../services/financial-engine.service';

@Component({
  selector: 'app-interest-calculator',
  templateUrl: './interest-calculator.component.html',
  styleUrls: ['./interest-calculator.component.scss']
})
export class InterestCalculatorComponent implements OnInit {

  form: FormGroup;
  result: number | null = null;
  resultLabel: string = '';

  constructor(
    private fb: FormBuilder,
    private engine: FinancialEngineService
  ) {
    this.form = this.fb.group({
      interestType: ['compound', Validators.required],
      targetVariable: ['vf', Validators.required], // vf, vp, i, n
      vp: [1000],
      vf: [null],
      i: [5], // % (se divide por 100 en el cálculo)
      n: [12]
    });
  }

  ngOnInit(): void {
    this.updateValidators();
    
    // Recalcular instantáneamente al cambiar algo
    this.form.valueChanges.subscribe(() => {
      this.calculate();
    });
    
    // Cambiar los inputs deshabilitados/habilitados cuando cambia el objetivo
    this.form.get('targetVariable')?.valueChanges.subscribe(() => {
      this.updateValidators();
    });

    this.calculate(); // initial calc
  }

  updateValidators(): void {
    const target = this.form.get('targetVariable')?.value;
    
    // Reset all controls to enabled state temporarily to adjust
    ['vp', 'vf', 'i', 'n'].forEach(ctrl => {
      this.form.get(ctrl)?.enable({emitEvent: false});
      this.form.get(ctrl)?.setValidators([Validators.required, Validators.min(0.0001)]); // Min to avoid div by 0 usually
    });

    // Disable the target variable control so user cannot type on it
    this.form.get(target)?.disable({emitEvent: false});
    this.form.get(target)?.clearValidators();

    this.form.updateValueAndValidity({emitEvent: false});
    this.calculate();
  }

  calculate(): void {
    if (this.form.invalid) {
      this.result = null;
      return;
    }

    const type = this.form.get('interestType')?.value;
    const target = this.form.get('targetVariable')?.value;
    
    // Get raw values including disabled controls (though we only need enabled ones)
    const rawValue = this.form.getRawValue();
    const vp = Number(rawValue.vp);
    const vf = Number(rawValue.vf);
    const i = Number(rawValue.i) / 100; // convert % to decimal
    const n = Number(rawValue.n);

    let res = 0;
    
    try {
      if (type === 'simple') {
        if (target === 'vf') res = this.engine.simpleFV(vp, i, n);
        else if (target === 'vp') res = this.engine.simplePV(vf, i, n);
        else if (target === 'i') res = this.engine.simpleRate(vf, vp, n) * 100; // back to %
        else if (target === 'n') res = this.engine.simplePeriods(vf, vp, i);
      } else {
        if (target === 'vf') res = this.engine.compoundFV(vp, i, n);
        else if (target === 'vp') res = this.engine.compoundPV(vf, i, n);
        else if (target === 'i') res = this.engine.compoundRate(vf, vp, n) * 100;
        else if (target === 'n') res = this.engine.compoundPeriods(vf, vp, i);
      }

      this.result = isNaN(res) || !isFinite(res) ? null : res;

      // Update labels
      const labels: any = { vf: 'Future Value (FV)', vp: 'Present Value (PV)', i: 'Interest Rate (%)', n: 'Periods (n)' };
      this.resultLabel = labels[target] || 'Result';

    } catch (e) {
      this.result = null;
    }
  }
}
