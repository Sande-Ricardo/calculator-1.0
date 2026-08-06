import { TestBed } from '@angular/core/testing';
import { VectorMathService } from './vector-math.service';
import { Vector3D } from '../models/vector.model';

describe('VectorMathService & Vector3D Model', () => {
  let service: VectorMathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VectorMathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correctly add vectors and calculate magnitude', () => {
    const v1 = new Vector3D(3, 4, 0);
    expect(v1.magnitude()).toBe(5);

    const v2 = new Vector3D(1, -2, 2);
    const sum = v1.add(v2);
    expect(sum.x).toBe(4);
    expect(sum.y).toBe(2);
    expect(sum.z).toBe(2);
  });

  it('should correctly calculate dot product and angle', () => {
    const u = new Vector3D(1, 0, 0);
    const v = new Vector3D(0, 1, 0);
    expect(u.dot(v)).toBe(0);
    expect(u.angleBetween(v, true)).toBe(90);
  });

  it('should correctly calculate cross product (right hand rule)', () => {
    const i = new Vector3D(1, 0, 0);
    const j = new Vector3D(0, 1, 0);
    const k = i.cross(j);
    expect(k.x).toBe(0);
    expect(k.y).toBe(0);
    expect(k.z).toBe(1);
  });

  it('should correctly convert to and from polar coordinates', () => {
    const polar = Vector3D.fromPolar(10, 60);
    expect(polar.x).toBeCloseTo(5, 5);
    expect(polar.y).toBeCloseTo(8.660254, 5);

    const backToPolar = polar.toPolar();
    expect(backToPolar.r).toBeCloseTo(10, 5);
    expect(backToPolar.theta).toBeCloseTo(60, 5);
  });

  it('should generate step-by-step resultant steps', () => {
    const v1 = new Vector3D(1, 2, 3);
    const v2 = new Vector3D(4, 5, 6);
    const stepResult = service.calculateResultant([
      { label: 'u', vector: v1 },
      { label: 'v', vector: v2 }
    ]);
    expect(stepResult.result.x).toBe(5);
    expect(stepResult.result.y).toBe(7);
    expect(stepResult.result.z).toBe(9);
    expect(stepResult.latexSteps.length).toBeGreaterThan(0);
  });
});
