import { TestBed } from '@angular/core/testing';
import { FormulaParserService } from './formula-parser.service';
import { PeriodicTableService } from './periodic-table.service';

describe('FormulaParserService', () => {
  let service: FormulaParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeriodicTableService]
    });
    service = TestBed.inject(FormulaParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse simple formula H2O', () => {
    const res = service.parseFormula('H2O');
    expect(res.isValid).toBeTrue();
    const h = res.elements.find(e => e.symbol === 'H');
    const o = res.elements.find(e => e.symbol === 'O');
    expect(h?.count).toBe(2);
    expect(o?.count).toBe(1);
    expect(res.totalMolarMass).toBeCloseTo(18.015, 2);
  });

  it('should parse nested formula Al2(SO4)3', () => {
    const res = service.parseFormula('Al2(SO4)3');
    expect(res.isValid).toBeTrue();
    const al = res.elements.find(e => e.symbol === 'Al');
    const s = res.elements.find(e => e.symbol === 'S');
    const o = res.elements.find(e => e.symbol === 'O');
    expect(al?.count).toBe(2);
    expect(s?.count).toBe(3);
    expect(o?.count).toBe(12);
  });

  it('should parse hydrates CuSO4*5H2O', () => {
    const res = service.parseFormula('CuSO4*5H2O');
    expect(res.isValid).toBeTrue();
    const cu = res.elements.find(e => e.symbol === 'Cu');
    const s = res.elements.find(e => e.symbol === 'S');
    const o = res.elements.find(e => e.symbol === 'O');
    const h = res.elements.find(e => e.symbol === 'H');
    
    expect(cu?.count).toBe(1);
    expect(s?.count).toBe(1);
    expect(o?.count).toBe(9); // 4 + 5*1
    expect(h?.count).toBe(10); // 5*2
  });

  it('should handle invalid symbols', () => {
    const res = service.parseFormula('Hz2O');
    expect(res.isValid).toBeFalse();
    expect(res.error).toContain('Invalid element symbol');
  });

  it('should handle unbalanced parentheses', () => {
    const res = service.parseFormula('C6(H12O6');
    expect(res.isValid).toBeFalse();
    expect(res.error).toContain('Unmatched opening parenthesis');
  });
});
