import { Injectable } from '@angular/core';
import { Vector3D } from '../models/vector.model';

export interface StepResult<T> {
  result: T;
  latexSteps: string[];
}

@Injectable({
  providedIn: 'root'
})
export class VectorMathService {

  constructor() { }

  /**
   * Mitigates floating point error artifacts.
   */
  public cleanNumber(num: number, precision: number = 6): number {
    return Vector3D.clean(num, precision);
  }

  /**
   * Generates step-by-step calculation for vector addition/resultant of N vectors.
   */
  public calculateResultant(vectors: { label: string; vector: Vector3D }[], is2D: boolean = false): StepResult<Vector3D> {
    if (!vectors || vectors.length === 0) {
      return { result: new Vector3D(), latexSteps: ['\\vec{R} = \\vec{0}'] };
    }

    let resultant = new Vector3D();
    const steps: string[] = [];

    const labels = vectors.map(v => `\\vec{${v.label}}`).join(' + ');
    steps.push(`\\vec{R} = ${labels}`);

    let xSumStr = vectors.map(v => `${v.vector.x}`).join(' + ');
    let ySumStr = vectors.map(v => `${v.vector.y}`).join(' + ');
    let zSumStr = vectors.map(v => `${v.vector.z}`).join(' + ');

    // Normalize double signs e.g., "+ -"
    xSumStr = xSumStr.replace(/\+\s\-/g, '- ');
    ySumStr = ySumStr.replace(/\+\s\-/g, '- ');
    zSumStr = zSumStr.replace(/\+\s\-/g, '- ');

    for (const item of vectors) {
      resultant = resultant.add(item.vector);
    }

    if (is2D) {
      steps.push(`R_x = ${xSumStr} = ${resultant.x}`);
      steps.push(`R_y = ${ySumStr} = ${resultant.y}`);
      steps.push(`\\vec{R} = (${resultant.x}, ${resultant.y}) = ${resultant.toUnitVectorString(true)}`);
    } else {
      steps.push(`R_x = ${xSumStr} = ${resultant.x}`);
      steps.push(`R_y = ${ySumStr} = ${resultant.y}`);
      steps.push(`R_z = ${zSumStr} = ${resultant.z}`);
      steps.push(`\\vec{R} = (${resultant.x}, ${resultant.y}, ${resultant.z}) = ${resultant.toUnitVectorString(false)}`);
    }

    const mag = resultant.magnitude();
    steps.push(`||\\vec{R}|| = \\sqrt{R_x^2 + R_y^2${is2D ? '' : ' + R_z^2'}} = ${mag}`);

    return { result: resultant, latexSteps: steps };
  }

  /**
   * Generates step-by-step calculation for Dot Product and Angle.
   */
  public calculateDotProduct(
    u: Vector3D, 
    v: Vector3D, 
    labelU: string = 'u', 
    labelV: string = 'v', 
    useDegrees: boolean = true,
    is2D: boolean = false
  ): StepResult<{ dotProduct: number; angle: number; magU: number; magV: number }> {
    const steps: string[] = [];

    steps.push(`\\vec{${labelU}} \\cdot \\vec{${labelV}} = u_x v_x + u_y v_y${is2D ? '' : ' + u_z v_z'}`);

    let calcStr = `(${u.x})(${v.x}) + (${u.y})(${v.y})${is2D ? '' : ` + (${u.z})(${v.z})`}`;
    const dotValue = u.dot(v);
    steps.push(`\\vec{${labelU}} \\cdot \\vec{${labelV}} = ${calcStr} = ${dotValue}`);

    const magU = u.magnitude();
    const magV = v.magnitude();

    steps.push(`||\\vec{${labelU}}|| = ${magU}, \\quad ||\\vec{${labelV}}|| = ${magV}`);

    const angle = u.angleBetween(v, useDegrees);
    const unitSymbol = useDegrees ? '^\\circ' : '\\text{ rad}';

    if (magU === 0 || magV === 0) {
      steps.push(`\\text{Angle undefined (zero vector present)}`);
    } else {
      steps.push(`\\cos(\\theta) = \\frac{\\vec{${labelU}} \\cdot \\vec{${labelV}}}{||\\vec{${labelU}}|| \\cdot ||\\vec{${labelV}}||} = \\frac{${dotValue}}{${magU} \\times ${magV}}`);
      steps.push(`\\theta = \\arccos\\left(${this.cleanNumber(dotValue / (magU * magV))}\\right) = ${angle}${unitSymbol}`);
    }

    return {
      result: { dotProduct: dotValue, angle, magU, magV },
      latexSteps: steps
    };
  }

  /**
   * Generates step-by-step calculation for Cross Product (3D determinant method).
   */
  public calculateCrossProduct(
    u: Vector3D, 
    v: Vector3D, 
    labelU: string = 'u', 
    labelV: string = 'v'
  ): StepResult<Vector3D> {
    const steps: string[] = [];

    steps.push(`\\vec{${labelU}} \\times \\vec{${labelV}} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ ${u.x} & ${u.y} & ${u.z} \\\\ ${v.x} & ${v.y} & ${v.z} \\end{vmatrix}`);

    const termI = `((${u.y})(${v.z}) - (${u.z})(${v.y}))\\hat{i}`;
    const termJ = `((${u.z})(${v.x}) - (${u.x})(${v.z}))\\hat{j}`;
    const termK = `((${u.x})(${v.y}) - (${u.y})(${v.x}))\\hat{k}`;

    steps.push(`= ${termI} + ${termJ} + ${termK}`);

    const crossRes = u.cross(v);
    steps.push(`= ${crossRes.toUnitVectorString(false)}`);
    steps.push(`\\vec{${labelU}} \\times \\vec{${labelV}} = (${crossRes.x}, ${crossRes.y}, ${crossRes.z})`);

    const area = crossRes.magnitude();
    steps.push(`\\text{Area of Parallelogram} = ||\\vec{${labelU}} \\times \\vec{${labelV}}|| = ${area}`);

    return {
      result: crossRes,
      latexSteps: steps
    };
  }

  /**
   * Generates step-by-step calculation for Vector Projection and Rejection (proj_v u).
   */
  public calculateProjection(
    u: Vector3D, 
    v: Vector3D, 
    labelU: string = 'u', 
    labelV: string = 'v',
    is2D: boolean = false
  ): StepResult<{ projection: Vector3D; rejection: Vector3D }> {
    const steps: string[] = [];

    const dotUV = u.dot(v);
    const magV = v.magnitude();
    const magVSq = magV * magV;

    steps.push(`\\text{proj}_{\\vec{${labelV}}}\\vec{${labelU}} = \\left( \\frac{\\vec{${labelU}} \\cdot \\vec{${labelV}}}{||\\vec{${labelV}}||^2} \\right) \\vec{${labelV}}`);

    if (magVSq === 0) {
      steps.push(`\\text{Cannot project onto zero vector } \\vec{${labelV}}`);
      return {
        result: { projection: new Vector3D(), rejection: new Vector3D() },
        latexSteps: steps
      };
    }

    const scalarProj = this.cleanNumber(dotUV / magVSq);
    steps.push(`= \\left( \\frac{${dotUV}}{${magVSq}} \\right) \\vec{${labelV}} = ${scalarProj} \\vec{${labelV}}`);

    const proj = u.projectOnto(v);
    steps.push(`\\text{proj}_{\\vec{${labelV}}}\\vec{${labelU}} = (${proj.x}, ${proj.y}${is2D ? '' : `, ${proj.z}`})`);

    const rej = u.rejectFrom(v);
    steps.push(`\\text{ort}_{\\vec{${labelV}}}\\vec{${labelU}} = \\vec{${labelU}} - \\text{proj}_{\\vec{${labelV}}}\\vec{${labelU}} = (${rej.x}, ${rej.y}${is2D ? '' : `, ${rej.z}`})`);

    return {
      result: { projection: proj, rejection: rej },
      latexSteps: steps
    };
  }
}
