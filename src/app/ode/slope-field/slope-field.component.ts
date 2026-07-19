import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ApiManagementService } from 'src/app/core/services/api-management.service';
import { OdeSlopeFieldRequestDTO, GridDTO } from 'src/app/interfaces/Ode';
import { OdeSolveRequestDTO } from 'src/app/interfaces/Ode';
import * as math from 'mathjs';

@Component({
  selector: 'app-slope-field',
  templateUrl: './slope-field.component.html',
  styleUrls: ['./slope-field.component.scss']
})
export class SlopeFieldComponent implements OnInit, AfterViewInit {
  @ViewChild('slopeCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // Form Inputs
  equation: string = 'exp(x) - 2*y';
  independentVar: string = 'x';
  dependentVar: string = 'y';

  xMin: number = -5;
  xMax: number = 5;
  xSteps: number = 20;
  yMin: number = -5;
  yMax: number = 5;
  ySteps: number = 20;

  // UI State
  loading: boolean = false;
  error: string = '';
  vectorFieldData: any = null;

  // IVP Interactive State
  x0: number | null = null;
  y0: number | null = null;
  particularSolutionFormula: string = '';
  particularSolutionMathJsNode: math.EvalFunction | null = null;
  solvingIvp: boolean = false;

  constructor(private apiService: ApiManagementService) { }

  ngOnInit(): void {
    // Initial calculation on load
    this.calculate();
  }

  ngAfterViewInit(): void {
    this.draw();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.draw();
  }

  calculate(): void {
    if (!this.equation.trim()) {
      this.error = 'Please enter a differential equation dy/dx.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.vectorFieldData = null;
    
    // Clear IVP when recalculating vector field
    this.clearIvp();

    const grid: GridDTO = {
      x_min: this.xMin,
      x_max: this.xMax,
      x_steps: this.xSteps,
      y_min: this.yMin,
      y_max: this.yMax,
      y_steps: this.ySteps
    };

    // Sanitize input using service helper
    const sanitizedEq = this.apiService.sanitizeExpression(this.equation.trim());

    const request: OdeSlopeFieldRequestDTO = {
      equation_dy_dx: sanitizedEq,
      independent_var: this.independentVar.trim() || 'x',
      dependent_var: this.dependentVar.trim() || 'y',
      grid: grid
    };

    this.apiService.solveOdeSlopeField(request).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.status === 'success') {
          this.vectorFieldData = res.vector_field;
          setTimeout(() => this.draw(), 50);
        } else {
          this.error = 'Calculation failed on the server side.';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Slope Field API Error:', err);
        this.error = 'Error calling the Slope Field API. Please verify the expression syntax.';
      }
    });
  }

  // Draw everything on the canvas
  draw(): void {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    
    // Fit canvas to parent container width
    const rect = canvas.parentElement?.getBoundingClientRect();
    const size = Math.min((rect?.width || 500), 600);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const W = canvas.width;
    const H = canvas.height;
    const padding = 40;

    // Scale helpers
    const scaleX = (W - 2 * padding) / (this.xMax - this.xMin);
    const scaleY = (H - 2 * padding) / (this.yMax - this.yMin);

    const toPixelX = (x: number) => padding + (x - this.xMin) * scaleX;
    const toPixelY = (y: number) => padding + (this.yMax - y) * scaleY;

    const toMathX = (px: number) => this.xMin + (px - padding) / scaleX;
    const toMathY = (py: number) => this.yMax - (py - padding) / scaleY;

    // Draw Background Grid Lines
    ctx.strokeStyle = '#334155'; // var(--surface-light)
    ctx.lineWidth = 1;
    ctx.fillStyle = '#94a3b8'; // var(--text-muted)
    ctx.font = '10px sans-serif';

    // X grid lines & labels
    const xStepSize = (this.xMax - this.xMin) / 10;
    for (let i = 0; i <= 10; i++) {
      const x = this.xMin + i * xStepSize;
      const px = toPixelX(x);
      
      ctx.beginPath();
      ctx.moveTo(px, padding);
      ctx.lineTo(px, H - padding);
      ctx.stroke();

      // Label
      ctx.fillText(x.toFixed(1), px - 10, H - padding + 15);
    }

    // Y grid lines & labels
    const yStepSize = (this.yMax - this.yMin) / 10;
    for (let i = 0; i <= 10; i++) {
      const y = this.yMin + i * yStepSize;
      const py = toPixelY(y);

      ctx.beginPath();
      ctx.moveTo(padding, py);
      ctx.lineTo(W - padding, py);
      ctx.stroke();

      // Label
      ctx.fillText(y.toFixed(1), padding - 30, py + 4);
    }

    // Draw Primary Axes
    ctx.strokeStyle = '#64748b'; // var(--border-light)
    ctx.lineWidth = 2;
    
    // Y Axis (x = 0)
    if (this.xMin <= 0 && this.xMax >= 0) {
      const pzX = toPixelX(0);
      ctx.beginPath();
      ctx.moveTo(pzX, padding);
      ctx.lineTo(pzX, H - padding);
      ctx.stroke();
    }

    // X Axis (y = 0)
    if (this.yMin <= 0 && this.yMax >= 0) {
      const pzY = toPixelY(0);
      ctx.beginPath();
      ctx.moveTo(padding, pzY);
      ctx.lineTo(W - padding, pzY);
      ctx.stroke();
    }

    // Draw Vector Field Slopes
    if (this.vectorFieldData) {
      const xArr = this.vectorFieldData.x;
      const yArr = this.vectorFieldData.y;
      const uArr = this.vectorFieldData.u;
      const vArr = this.vectorFieldData.v;

      const segmentLen = 16; // length of slope segment in pixels

      for (let i = 0; i < xArr.length; i++) {
        const mx = xArr[i];
        const my = yArr[i];
        const u = uArr[i];
        const v = vArr[i];

        const cx = toPixelX(mx);
        const cy = toPixelY(my);

        // Map math vector to pixel offsets
        const pdx = u * scaleX;
        const pdy = -v * scaleY; // y inverted in canvas

        // Normalize pixel displacement
        const d = Math.sqrt(pdx * pdx + pdy * pdy);
        if (d === 0) continue;

        const ndx = pdx / d;
        const ndy = pdy / d;

        // Start and end points of the line segment
        const xStart = cx - ndx * (segmentLen / 2);
        const yStart = cy - ndy * (segmentLen / 2);
        const xEnd = cx + ndx * (segmentLen / 2);
        const yEnd = cy + ndy * (segmentLen / 2);

        // Generate gorgeous gradient based on slope angle
        const angle = Math.atan2(v, u);
        const normAngle = (angle + Math.PI) % Math.PI; // [0, pi]
        const hue = 180 + (normAngle / Math.PI) * 120; // 180 (Cyan) to 300 (Magenta)

        ctx.strokeStyle = `hsla(${hue}, 85%, 65%, 0.8)`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();

        // Draw a tiny dot at the center of the segment for clean look
        ctx.fillStyle = `hsla(${hue}, 85%, 65%, 0.4)`;
        ctx.beginPath();
        ctx.arc(cx, cy, 1.5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Draw Interactive IVP Point & Solution Curve
    if (this.x0 !== null && this.y0 !== null) {
      const cx0 = toPixelX(this.x0);
      const cy0 = toPixelY(this.y0);

      // Draw particular solution curve if parsed successfully
      if (this.particularSolutionMathJsNode) {
        ctx.strokeStyle = '#10b981'; // var(--success-color)
        ctx.lineWidth = 4;
        ctx.beginPath();

        let first = true;
        const numPoints = 150;
        const mathStep = (this.xMax - this.xMin) / numPoints;

        for (let i = 0; i <= numPoints; i++) {
          const evalX = this.xMin + i * mathStep;
          try {
            // Evaluate using math.js compiler
            const evalY = this.particularSolutionMathJsNode.evaluate({ x: evalX });
            
            // Check for valid number
            if (typeof evalY === 'number' && !isNaN(evalY) && isFinite(evalY)) {
              const pX = toPixelX(evalX);
              const pY = toPixelY(evalY);

              // Don't draw outside canvas vertical margins excessively
              if (pY >= padding && pY <= H - padding) {
                if (first) {
                  ctx.moveTo(pX, pY);
                  first = false;
                } else {
                  ctx.lineTo(pX, pY);
                }
              } else {
                // If it goes offscreen, reset path drawing line
                first = true;
              }
            } else {
              first = true;
            }
          } catch (e) {
            // Expression evaluation failed for this point (e.g. division by zero, domain error)
            first = true;
          }
        }
        ctx.stroke();
      }

      // Draw Clicked Dot
      ctx.fillStyle = '#10b981'; // var(--success-color)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx0, cy0, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }

  // Handle click on canvas to solve particular solution (IVP)
  onCanvasClick(event: MouseEvent): void {
    if (!this.vectorFieldData || this.loading || this.solvingIvp) return;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;

    const padding = 40;
    const W = canvas.width;
    const H = canvas.height;

    // Check if within grid bounds
    if (px < padding || px > W - padding || py < padding || py > H - padding) {
      return;
    }

    const scaleX = (W - 2 * padding) / (this.xMax - this.xMin);
    const scaleY = (H - 2 * padding) / (this.yMax - this.yMin);

    const clickedMathX = this.xMin + (px - padding) / scaleX;
    const clickedMathY = this.yMax - (py - padding) / scaleY;

    // Set initial values
    this.x0 = parseFloat(clickedMathX.toFixed(3));
    this.y0 = parseFloat(clickedMathY.toFixed(3));
    this.solveIvpCurve();
  }

  solveIvpCurve(): void {
    if (this.x0 === null || this.y0 === null) return;

    this.solvingIvp = true;
    this.particularSolutionFormula = '';
    this.particularSolutionMathJsNode = null;

    const sanitizedEq = this.apiService.sanitizeExpression(this.equation.trim());

    // Call Analytical Solver to compute particular solution
    const req: OdeSolveRequestDTO = {
      equation: `${this.dependentVar}' = ${sanitizedEq}`,
      independent_var: this.independentVar.trim() || 'x',
      dependent_var: this.dependentVar.trim() || 'y',
      initial_conditions: {
        x0: this.x0,
        y0: this.y0
      }
    };

    this.apiService.solveOde(req).subscribe({
      next: (res) => {
        this.solvingIvp = false;
        if (res.status === 'success' && res.particular_solution) {
          // Response particular solution: e.g. "y(x) = C1*exp(-2*x) + exp(x)/3"
          this.particularSolutionFormula = res.particular_solution;
          
          try {
            // Extract the right hand side of "y(x) = ..."
            const parts = res.particular_solution.split('=');
            if (parts.length === 2) {
              const rhs = parts[1].trim();
              
              // Compile the math.js expression for quick client evaluations
              const compiled = math.compile(rhs);
              this.particularSolutionMathJsNode = compiled;
            }
          } catch (e) {
            console.error('Error parsing particular solution for canvas rendering:', e);
          }
          this.draw();
        } else {
          // If server fails or expression has no analytical solution
          this.draw();
        }
      },
      error: (err) => {
        this.solvingIvp = false;
        console.error('IVP particular solution retrieval failed:', err);
        this.draw();
      }
    });
  }

  clearIvp(): void {
    this.x0 = null;
    this.y0 = null;
    this.particularSolutionFormula = '';
    this.particularSolutionMathJsNode = null;
    this.draw();
  }

  resetAll(): void {
    this.equation = 'exp(x) - 2*y';
    this.independentVar = 'x';
    this.dependentVar = 'y';
    this.xMin = -5;
    this.xMax = 5;
    this.xSteps = 20;
    this.yMin = -5;
    this.yMax = 5;
    this.ySteps = 20;
    this.error = '';
    this.clearIvp();
    this.calculate();
  }
}
