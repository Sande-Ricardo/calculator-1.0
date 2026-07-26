import { Injectable } from '@angular/core';

export interface AmortizationRow {
  period: number;
  initialBalance: number;
  installment: number; // Cuota total
  interest: number;    // Interés pagado
  principalPayment: number; // Capital amortizado
  finalBalance: number;
}

@Injectable({
  providedIn: 'root'
})
export class FinancialEngineService {

  constructor() { }

  // --- Subsistema A: Interés Simple ---
  
  simpleFV(vp: number, i: number, n: number): number {
    return vp * (1 + i * n);
  }
  
  simplePV(vf: number, i: number, n: number): number {
    return vf / (1 + i * n);
  }
  
  simpleRate(vf: number, vp: number, n: number): number {
    return (vf / vp - 1) / n;
  }
  
  simplePeriods(vf: number, vp: number, i: number): number {
    return (vf / vp - 1) / i;
  }

  // --- Subsistema A: Interés Compuesto ---

  compoundFV(vp: number, i: number, n: number): number {
    return vp * Math.pow(1 + i, n);
  }

  compoundPV(vf: number, i: number, n: number): number {
    return vf / Math.pow(1 + i, n);
  }

  compoundRate(vf: number, vp: number, n: number): number {
    return Math.pow(vf / vp, 1 / n) - 1;
  }

  compoundPeriods(vf: number, vp: number, i: number): number {
    return Math.log(vf / vp) / Math.log(1 + i);
  }

  // --- Subsistema B: Tablas de Amortización ---

  /**
   * Sistema Francés: Cuota fija
   */
  generateFrenchAmortization(vp: number, i: number, n: number): AmortizationRow[] {
    const table: AmortizationRow[] = [];
    if (i === 0) {
      // Caso borde: sin interés
      const cuota = vp / n;
      let balance = vp;
      for (let p = 1; p <= n; p++) {
        table.push({ period: p, initialBalance: balance, installment: cuota, interest: 0, principalPayment: cuota, finalBalance: balance - cuota });
        balance -= cuota;
      }
      return table;
    }

    const cuotaFija = vp * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    let balance = vp;

    for (let p = 1; p <= n; p++) {
      const interes = balance * i;
      const amortizacion = cuotaFija - interes;
      const finalBalance = Math.max(0, balance - amortizacion); // Evitar decimales negativos muy chicos
      
      table.push({
        period: p,
        initialBalance: balance,
        installment: cuotaFija,
        interest: interes,
        principalPayment: amortizacion,
        finalBalance: finalBalance
      });
      balance = finalBalance;
    }
    return table;
  }

  /**
   * Sistema Alemán: Amortización de capital constante
   */
  generateGermanAmortization(vp: number, i: number, n: number): AmortizationRow[] {
    const table: AmortizationRow[] = [];
    const amortizacionConstante = vp / n;
    let balance = vp;

    for (let p = 1; p <= n; p++) {
      const interes = balance * i;
      const cuota = amortizacionConstante + interes;
      const finalBalance = Math.max(0, balance - amortizacionConstante);

      table.push({
        period: p,
        initialBalance: balance,
        installment: cuota,
        interest: interes,
        principalPayment: amortizacionConstante,
        finalBalance: finalBalance
      });
      balance = finalBalance;
    }
    return table;
  }

  /**
   * Sistema Americano: Intereses fijos, el capital se devuelve al final
   */
  generateAmericanAmortization(vp: number, i: number, n: number): AmortizationRow[] {
    const table: AmortizationRow[] = [];
    let balance = vp;
    const interesConstante = vp * i;

    for (let p = 1; p <= n; p++) {
      const isLast = p === n;
      const amortizacion = isLast ? vp : 0;
      const cuota = interesConstante + amortizacion;
      const finalBalance = isLast ? 0 : balance;

      table.push({
        period: p,
        initialBalance: balance,
        installment: cuota,
        interest: interesConstante,
        principalPayment: amortizacion,
        finalBalance: finalBalance
      });
      balance = finalBalance;
    }
    return table;
  }

  // --- Subsistema C: Evaluación de Proyectos ---

  calculateNPV(initialInvestment: number, cashFlows: number[], discountRate: number): number {
    let npv = -initialInvestment;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + discountRate, t + 1);
    }
    return npv;
  }

  calculateIRR(initialInvestment: number, cashFlows: number[], tolerance: number = 1e-6): number {
    let rate = 0.1; // Estimación inicial del 10%
    const maxIterations = 100;

    for (let i = 0; i < maxIterations; i++) {
      let npv = -initialInvestment;
      let derivativeNpv = 0;

      for (let t = 0; t < cashFlows.length; t++) {
        const period = t + 1;
        const cf = cashFlows[t];
        npv += cf / Math.pow(1 + rate, period);
        derivativeNpv -= (period * cf) / Math.pow(1 + rate, period + 1);
      }

      if (Math.abs(npv) < tolerance) return rate;

      const newRate = rate - (npv / derivativeNpv);
      
      // Si la nueva tasa es muy similar a la anterior, convergió.
      if (Math.abs(newRate - rate) < tolerance) return newRate;
      
      rate = newRate;
    }
    return rate; // Devuelve la mejor aproximación si no converge (o podríamos lanzar error)
  }

}
