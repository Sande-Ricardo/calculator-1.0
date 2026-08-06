export interface Vector2DCoords {
  x: number;
  y: number;
}

export interface Vector3DCoords {
  x: number;
  y: number;
  z: number;
}

export interface PolarCoords {
  r: number;
  theta: number; // in degrees by default when passed/returned with flag
}

export interface SphericalCoords {
  r: number;
  theta: number; // azimuth angle
  phi: number;   // polar / inclination angle
}

export class Vector3D {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = Vector3D.clean(x);
    this.y = Vector3D.clean(y);
    this.z = Vector3D.clean(z);
  }

  public static clean(val: number, precision: number = 10): number {
    if (Math.abs(val) < 1e-12) return 0;
    const factor = Math.pow(10, precision);
    return Math.round(val * factor) / factor;
  }

  public static fromCartesian(x: number, y: number, z: number = 0): Vector3D {
    return new Vector3D(x, y, z);
  }

  public static fromPolar(r: number, thetaDeg: number): Vector3D {
    const rad = (thetaDeg * Math.PI) / 180;
    const x = r * Math.cos(rad);
    const y = r * Math.sin(rad);
    return new Vector3D(x, y, 0);
  }

  public static fromSpherical(r: number, thetaDeg: number, phiDeg: number): Vector3D {
    const thetaRad = (thetaDeg * Math.PI) / 180;
    const phiRad = (phiDeg * Math.PI) / 180;
    // Standard physics convention: r, theta (azimuth in xy plane), phi (angle from z axis)
    const x = r * Math.sin(phiRad) * Math.cos(thetaRad);
    const y = r * Math.sin(phiRad) * Math.sin(thetaRad);
    const z = r * Math.cos(phiRad);
    return new Vector3D(x, y, z);
  }

  public toPolar(): PolarCoords {
    const r = this.magnitude();
    let thetaRad = Math.atan2(this.y, this.x);
    let thetaDeg = (thetaRad * 180) / Math.PI;
    if (thetaDeg < 0) thetaDeg += 360;
    return {
      r: Vector3D.clean(r),
      theta: Vector3D.clean(thetaDeg)
    };
  }

  public toSpherical(): SphericalCoords {
    const r = this.magnitude();
    if (r === 0) {
      return { r: 0, theta: 0, phi: 0 };
    }
    let thetaRad = Math.atan2(this.y, this.x);
    let thetaDeg = (thetaRad * 180) / Math.PI;
    if (thetaDeg < 0) thetaDeg += 360;

    let phiRad = Math.acos(Math.min(Math.max(this.z / r, -1), 1));
    let phiDeg = (phiRad * 180) / Math.PI;

    return {
      r: Vector3D.clean(r),
      theta: Vector3D.clean(thetaDeg),
      phi: Vector3D.clean(phiDeg)
    };
  }

  public add(other: Vector3D): Vector3D {
    return new Vector3D(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  public subtract(other: Vector3D): Vector3D {
    return new Vector3D(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  public scalarMultiply(scalar: number): Vector3D {
    return new Vector3D(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  public magnitude(): number {
    return Vector3D.clean(Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z));
  }

  public normalize(): Vector3D {
    const mag = this.magnitude();
    if (mag === 0) return new Vector3D(0, 0, 0);
    return new Vector3D(this.x / mag, this.y / mag, this.z / mag);
  }

  public dot(other: Vector3D): number {
    return Vector3D.clean(this.x * other.x + this.y * other.y + this.z * other.z);
  }

  public cross(other: Vector3D): Vector3D {
    const cx = this.y * other.z - this.z * other.y;
    const cy = this.z * other.x - this.x * other.z;
    const cz = this.x * other.y - this.y * other.x;
    return new Vector3D(cx, cy, cz);
  }

  public angleBetween(other: Vector3D, useDegrees: boolean = true): number {
    const magA = this.magnitude();
    const magB = other.magnitude();
    if (magA === 0 || magB === 0) return 0;

    const dotProd = this.dot(other);
    const cosTheta = Math.min(Math.max(dotProd / (magA * magB), -1), 1);
    const rad = Math.acos(cosTheta);

    if (useDegrees) {
      return Vector3D.clean((rad * 180) / Math.PI);
    }
    return Vector3D.clean(rad);
  }

  public projectOnto(other: Vector3D): Vector3D {
    const otherMagSq = other.x * other.x + other.y * other.y + other.z * other.z;
    if (otherMagSq === 0) return new Vector3D(0, 0, 0);
    const scalar = this.dot(other) / otherMagSq;
    return other.scalarMultiply(scalar);
  }

  public rejectFrom(other: Vector3D): Vector3D {
    return this.subtract(this.projectOnto(other));
  }

  public equals(other: Vector3D, tolerance: number = 1e-6): boolean {
    return (
      Math.abs(this.x - other.x) < tolerance &&
      Math.abs(this.y - other.y) < tolerance &&
      Math.abs(this.z - other.z) < tolerance
    );
  }

  public toString(is2D: boolean = false): string {
    if (is2D) {
      return `(${this.x}, ${this.y})`;
    }
    return `(${this.x}, ${this.y}, ${this.z})`;
  }

  public toUnitVectorString(is2D: boolean = false): string {
    const formatComp = (val: number, unit: string, isFirst: boolean) => {
      if (val === 0) return '';
      const sign = val < 0 ? (isFirst ? '-' : ' - ') : (isFirst ? '' : ' + ');
      const absVal = Math.abs(val);
      const valStr = absVal === 1 ? '' : `${absVal}`;
      return `${sign}${valStr}\\hat{${unit}}`;
    };

    let res = formatComp(this.x, 'i', true);
    const yStr = formatComp(this.y, 'j', res === '');
    res += yStr;
    if (!is2D) {
      const zStr = formatComp(this.z, 'k', res === '');
      res += zStr;
    }
    return res || '0';
  }
}
