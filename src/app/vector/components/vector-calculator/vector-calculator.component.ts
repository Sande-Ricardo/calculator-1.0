import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Vector3D } from '../../models/vector.model';
import { VectorMathService, StepResult } from '../../services/vector-math.service';

export type DimensionMode = '2D' | '3D';
export type CoordSystem = 'cartesian' | 'polar';
export type AngleUnit = 'deg' | 'rad';
export type OperationType = 'resultant' | 'dot' | 'cross' | 'projection';
export type PhysicsTemplate = 'none' | 'statics' | 'dynamics' | 'electromagnetism';

@Component({
  selector: 'app-vector-calculator',
  templateUrl: './vector-calculator.component.html',
  styleUrls: ['./vector-calculator.component.scss']
})
export class VectorCalculatorComponent implements OnInit, OnDestroy {
  // UI State
  dimensionMode: DimensionMode = '2D';
  coordSystem: CoordSystem = 'cartesian';
  angleUnit: AngleUnit = 'deg';
  operation: OperationType = 'resultant';
  physicsTemplate: PhysicsTemplate = 'none';
  showSteps: boolean = false;

  // Dynamic Reactive Form
  vectorForm!: FormGroup;
  private formSub!: Subscription;

  // Computational Outputs
  parsedVectors: { label: string; vector: Vector3D }[] = [];
  resultantData: StepResult<Vector3D> | null = null;
  dotData: StepResult<{ dotProduct: number; angle: number; magU: number; magV: number }> | null = null;
  crossData: StepResult<Vector3D> | null = null;
  projData: StepResult<{ projection: Vector3D; rejection: Vector3D }> | null = null;

  constructor(
    private fb: FormBuilder,
    public vectorMath: VectorMathService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }

  get vectorsArray(): FormArray {
    return this.vectorForm.get('vectors') as FormArray;
  }

  private initForm(): void {
    this.vectorForm = this.fb.group({
      vectors: this.fb.array([])
    });

    // Default initial vectors
    this.addVector('A', 3, 4, 0);
    this.addVector('B', -1, 2, 0);

    this.formSub = this.vectorForm.valueChanges.subscribe(() => {
      this.calculate();
    });

    this.calculate();
  }

  createVectorGroup(label: string = 'A', v1: number = 0, v2: number = 0, v3: number = 0): FormGroup {
    return this.fb.group({
      label: [label, Validators.required],
      val1: [v1, Validators.required],
      val2: [v2, Validators.required],
      val3: [v3, Validators.required]
    });
  }

  addVector(label?: string, v1: number = 0, v2: number = 0, v3: number = 0): void {
    const nextChar = label || String.fromCharCode(65 + this.vectorsArray.length);
    this.vectorsArray.push(this.createVectorGroup(nextChar, v1, v2, v3));
  }

  removeVector(index: number): void {
    if (this.vectorsArray.length > 2 || this.operation === 'resultant') {
      if (this.vectorsArray.length > 1) {
        this.vectorsArray.removeAt(index);
      }
    }
  }

  setDimensionMode(mode: DimensionMode): void {
    if (this.dimensionMode === mode) return;
    this.dimensionMode = mode;
    this.calculate();
  }

  setCoordSystem(system: CoordSystem): void {
    if (this.coordSystem === system) return;
    this.coordSystem = system;
    this.calculate();
  }

  setAngleUnit(unit: AngleUnit): void {
    if (this.angleUnit === unit) return;
    this.angleUnit = unit;
    this.calculate();
  }

  setOperation(op: OperationType): void {
    this.operation = op;
    // Adjust vector count requirements if necessary
    if ((op === 'dot' || op === 'cross' || op === 'projection') && this.vectorsArray.length < 2) {
      while (this.vectorsArray.length < 2) {
        this.addVector();
      }
    }
    this.calculate();
  }

  applyPhysicsTemplate(template: PhysicsTemplate): void {
    this.physicsTemplate = template;
    // Clear array
    while (this.vectorsArray.length !== 0) {
      this.vectorsArray.removeAt(0);
    }

    if (template === 'statics') {
      // Net Force \Sigma F = 0
      this.dimensionMode = '2D';
      this.operation = 'resultant';
      this.addVector('F1', 50, 30, 0);
      this.addVector('F2', -30, 40, 0);
      this.addVector('F3', -20, -70, 0);
    } else if (template === 'dynamics') {
      // Torque \tau = r \times F
      this.dimensionMode = '3D';
      this.operation = 'cross';
      this.addVector('r (Pos)', 0.5, 0.2, 0);
      this.addVector('F (Force)', 0, 100, -50);
    } else if (template === 'electromagnetism') {
      // Lorentz Force F = q(v \times B)
      this.dimensionMode = '3D';
      this.operation = 'cross';
      this.addVector('v (Vel)', 3000, 0, 0);
      this.addVector('B (Field)', 0, 0.05, 0.02);
    } else {
      // None / Default
      this.addVector('A', 3, 4, 0);
      this.addVector('B', -1, 2, 0);
    }
  }

  toggleShowSteps(): void {
    this.showSteps = !this.showSteps;
  }

  calculate(): void {
    const is2D = this.dimensionMode === '2D';
    const formVals = this.vectorsArray.value as { label: string; val1: number; val2: number; val3: number }[];

    this.parsedVectors = formVals.map(item => {
      let vec: Vector3D;
      const v1 = Number(item.val1) || 0;
      const v2 = Number(item.val2) || 0;
      const v3 = Number(item.val3) || 0;

      if (this.coordSystem === 'cartesian') {
        vec = Vector3D.fromCartesian(v1, v2, is2D ? 0 : v3);
      } else {
        // Polar (2D) or Spherical (3D)
        const angleConvFactor = this.angleUnit === 'rad' ? (180 / Math.PI) : 1;
        if (is2D) {
          vec = Vector3D.fromPolar(v1, v2 * angleConvFactor);
        } else {
          vec = Vector3D.fromSpherical(v1, v2 * angleConvFactor, v3 * angleConvFactor);
        }
      }
      return { label: item.label || 'V', vector: vec };
    });

    const isDegrees = this.angleUnit === 'deg';

    // Perform operational calculations
    if (this.operation === 'resultant') {
      this.resultantData = this.vectorMath.calculateResultant(this.parsedVectors, is2D);
    } else if (this.operation === 'dot' && this.parsedVectors.length >= 2) {
      const u = this.parsedVectors[0];
      const v = this.parsedVectors[1];
      this.dotData = this.vectorMath.calculateDotProduct(u.vector, v.vector, u.label, v.label, isDegrees, is2D);
    } else if (this.operation === 'cross' && this.parsedVectors.length >= 2) {
      const u = this.parsedVectors[0];
      const v = this.parsedVectors[1];
      this.crossData = this.vectorMath.calculateCrossProduct(u.vector, v.vector, u.label, v.label);
    } else if (this.operation === 'projection' && this.parsedVectors.length >= 2) {
      const u = this.parsedVectors[0];
      const v = this.parsedVectors[1];
      this.projData = this.vectorMath.calculateProjection(u.vector, v.vector, u.label, v.label, is2D);
    }
  }

  // Label getters for dynamic coordinate inputs
  getVal1Label(): string {
    return this.coordSystem === 'cartesian' ? 'X' : 'Magnitude (r)';
  }

  getVal2Label(): string {
    if (this.coordSystem === 'cartesian') return 'Y';
    return this.dimensionMode === '2D' ? `Angle θ (${this.angleUnit})` : `Azimuth θ (${this.angleUnit})`;
  }

  getVal3Label(): string {
    if (this.coordSystem === 'cartesian') return 'Z';
    return `Polar φ (${this.angleUnit})`;
  }
}
