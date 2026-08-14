import { Component, OnInit, AfterViewInit, OnChanges, SimpleChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Vector3D } from '../../models/vector.model';

declare var Plotly: any;

@Component({
  selector: 'app-vector-visualizer',
  templateUrl: './vector-visualizer.component.html',
  styleUrls: ['./vector-visualizer.component.scss']
})
export class VectorVisualizerComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('canvas2D') canvas2DRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('plotly3DContainer') plotly3DRef!: ElementRef<HTMLDivElement>;

  @Input() vectors: { label: string; vector: Vector3D }[] = [];
  @Input() resultant: Vector3D | null = null;
  @Input() is2D: boolean = true;
  @Input() operation: string = 'resultant';
  @Input() coordSystem: 'cartesian' | 'polar' = 'cartesian';
  @Input() projectionResult: { projection: Vector3D; rejection: Vector3D } | null = null;

  isPlotlyLoaded: boolean = false;
  palette: string[] = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.loadPlotlyScript();
  }

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['vectors']?.firstChange || !changes['is2D']?.firstChange || !changes['coordSystem']?.firstChange) {
      setTimeout(() => this.render(), 50);
    }
  }

  private loadPlotlyScript(): void {
    if (typeof Plotly !== 'undefined') {
      this.isPlotlyLoaded = true;
      return;
    }

    const scriptId = 'plotly-script';
    if (document.getElementById(scriptId)) {
      this.checkPlotlyLoaded();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://cdn.plot.ly/plotly-2.27.0.min.js';
    script.async = true;
    script.onload = () => {
      this.isPlotlyLoaded = true;
      this.render();
    };
    script.onerror = () => {
      console.warn('Plotly CDN load failed, falling back to 2D Canvas engine.');
    };
    document.head.appendChild(script);
  }

  private checkPlotlyLoaded(): void {
    if (typeof Plotly !== 'undefined') {
      this.isPlotlyLoaded = true;
      this.render();
    } else {
      setTimeout(() => this.checkPlotlyLoaded(), 100);
    }
  }

  get isDisabled3DSpherical(): boolean {
    return !this.is2D && this.coordSystem === 'polar';
  }

  public render(): void {
    if (this.isDisabled3DSpherical) {
      return;
    }
    if (this.is2D) {
      this.draw2DCanvas();
    } else {
      this.draw3DPlotly();
    }
  }

  // --- 2D CANVAS RENDER ENGINE ---
  private draw2DCanvas(): void {
    if (!this.canvas2DRef) return;
    const canvas = this.canvas2DRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match container width
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect && rect.width > 0) {
      canvas.width = rect.width;
      canvas.height = Math.min(rect.width * 0.7, 400);
    }

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Compute bounding box for scaling
    let allPoints: { x: number; y: number }[] = [{ x: 0, y: 0 }];

    this.vectors.forEach(v => {
      allPoints.push({ x: v.vector.x, y: v.vector.y });
    });

    if (this.resultant && this.operation === 'resultant') {
      allPoints.push({ x: this.resultant.x, y: this.resultant.y });
    }

    if (this.projectionResult && this.operation === 'projection') {
      allPoints.push({ x: this.projectionResult.projection.x, y: this.projectionResult.projection.y });
      allPoints.push({ x: this.projectionResult.rejection.x, y: this.projectionResult.rejection.y });
    }

    let maxX = Math.max(...allPoints.map(p => Math.abs(p.x)), 5);
    let maxY = Math.max(...allPoints.map(p => Math.abs(p.y)), 5);
    let maxVal = Math.max(maxX, maxY) * 1.25;

    // Coordinate mapping functions
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / (2 * maxVal);

    const toScreenX = (x: number) => centerX + x * scale;
    const toScreenY = (y: number) => centerY - y * scale;

    // 1. Draw Grid Lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const step = Math.pow(10, Math.floor(Math.log10(maxVal))) || 1;

    if (this.coordSystem === 'cartesian') {
      for (let x = -maxVal; x <= maxVal; x += step) {
        const sx = toScreenX(x);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, height);
        ctx.stroke();
      }

      for (let y = -maxVal; y <= maxVal; y += step) {
        const sy = toScreenY(y);
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(width, sy);
        ctx.stroke();
      }

      // 2. Draw Main Axes (X and Y)
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();

      // Axis Labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "Inter", sans-serif';
      ctx.fillText('X', width - 15, centerY - 8);
      ctx.fillText('Y', centerX + 8, 15);
    } else {
      // POLAR GRID
      for (let r = step; r <= maxVal * 1.5; r += step) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r * scale, 0, 2 * Math.PI);
        ctx.stroke();
      }

      const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
      angles.forEach(deg => {
        const rad = deg * Math.PI / 180;
        const outX = centerX + Math.cos(rad) * maxVal * 1.5 * scale;
        const outY = centerY - Math.sin(rad) * maxVal * 1.5 * scale;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(outX, outY);
        ctx.stroke();

        if (deg % 90 === 0 || deg % 45 === 0) {
          ctx.fillStyle = '#94a3b8';
          ctx.font = '11px "Inter", sans-serif';
          const textX = centerX + Math.cos(rad) * (maxVal * 1.5 * scale + 15);
          const textY = centerY - Math.sin(rad) * (maxVal * 1.5 * scale + 15);
          ctx.fillText(`${deg}°`, textX - 8, textY + 4);
        }
      });
      
      // Main axes bolder
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height); ctx.stroke();
    }

    // 3. Draw Input Vectors
    this.vectors.forEach((item, index) => {
      const color = this.palette[index % this.palette.length];
      this.drawArrow2D(ctx, centerX, centerY, toScreenX(item.vector.x), toScreenY(item.vector.y), color, `v_${item.label}`, false);
    });

    // 4. Draw Resultant or Projection Vector
    if (this.operation === 'resultant' && this.resultant) {
      this.drawArrow2D(ctx, centerX, centerY, toScreenX(this.resultant.x), toScreenY(this.resultant.y), '#38bdf8', 'R (Resultant)', true);
    } else if (this.operation === 'projection' && this.projectionResult) {
      const proj = this.projectionResult.projection;
      const rej = this.projectionResult.rejection;
      this.drawArrow2D(ctx, centerX, centerY, toScreenX(proj.x), toScreenY(proj.y), '#38bdf8', 'proj_v u', true);
      this.drawArrow2D(ctx, centerX, centerY, toScreenX(rej.x), toScreenY(rej.y), '#a855f7', 'ort_v u', true);
    }
  }

  private drawArrow2D(
    ctx: CanvasRenderingContext2D, 
    fromX: number, 
    fromY: number, 
    toX: number, 
    toY: number, 
    color: string, 
    label: string, 
    isDashed: boolean
  ): void {
    const headlen = 10; // length of head in pixels
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = isDashed ? 3 : 2.5;

    if (isDashed) {
      ctx.setLineDash([6, 4]);
    }

    // Line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.setLineDash([]); // Reset dash for arrowhead

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // Label
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText(label, toX + 8, toY - 6);

    ctx.restore();
  }

  private format3DLabel(namePrefix: string, v: Vector3D): string {
    if (this.coordSystem === 'polar') {
      const sph = v.toSpherical();
      return `${namePrefix} (r: ${sph.r}, θ: ${sph.theta}°, φ: ${sph.phi}°)`;
    }
    return `${namePrefix} (${v.x}, ${v.y}, ${v.z})`;
  }

  // --- 3D PLOTLY RENDER ENGINE ---
  private draw3DPlotly(): void {
    if (!this.plotly3DRef || typeof Plotly === 'undefined') return;

    const dataTraces: any[] = [];
    const originLabel = this.translate.instant('VECTOR.VISUALIZER.ORIGIN');
    const resultantLabel = this.translate.instant('VECTOR.VISUALIZER.RESULTANT_LABEL');
    const crossLabel = this.translate.instant('VECTOR.VISUALIZER.CROSS_LABEL');

    // Origin point
    dataTraces.push({
      type: 'scatter3d',
      mode: 'markers',
      x: [0], y: [0], z: [0],
      marker: { size: 4, color: '#f8fafc' },
      name: originLabel,
      showlegend: false
    });

    // 1. Draw Input Vectors
    this.vectors.forEach((item, index) => {
      const color = this.palette[index % this.palette.length];
      dataTraces.push({
        type: 'scatter3d',
        mode: 'lines+markers+text',
        x: [0, item.vector.x],
        y: [0, item.vector.y],
        z: [0, item.vector.z],
        line: { color: color, width: 6 },
        marker: { size: [0, 5], color: color },
        text: ['', `v_${item.label}`],
        textposition: 'top center',
        name: this.format3DLabel(`v_${item.label}`, item.vector)
      });
    });

    // 2. Draw Resultant or Cross or Projection
    if (this.operation === 'resultant' && this.resultant) {
      dataTraces.push({
        type: 'scatter3d',
        mode: 'lines+markers+text',
        x: [0, this.resultant.x],
        y: [0, this.resultant.y],
        z: [0, this.resultant.z],
        line: { color: '#38bdf8', width: 8, dash: 'dash' },
        marker: { size: [0, 7], color: '#38bdf8' },
        text: ['', resultantLabel],
        textposition: 'top center',
        name: this.format3DLabel(resultantLabel, this.resultant)
      });
    } else if (this.operation === 'cross' && this.resultant) {
      dataTraces.push({
        type: 'scatter3d',
        mode: 'lines+markers+text',
        x: [0, this.resultant.x],
        y: [0, this.resultant.y],
        z: [0, this.resultant.z],
        line: { color: '#f43f5e', width: 8, dash: 'dash' },
        marker: { size: [0, 7], color: '#f43f5e' },
        text: ['', crossLabel],
        textposition: 'top center',
        name: this.format3DLabel(crossLabel, this.resultant)
      });
    } else if (this.operation === 'projection' && this.projectionResult) {
      const proj = this.projectionResult.projection;
      const rej = this.projectionResult.rejection;
      
      dataTraces.push({
        type: 'scatter3d',
        mode: 'lines+markers+text',
        x: [0, proj.x],
        y: [0, proj.y],
        z: [0, proj.z],
        line: { color: '#38bdf8', width: 8, dash: 'dash' },
        marker: { size: [0, 7], color: '#38bdf8' },
        text: ['', 'proj_v u'],
        textposition: 'top center',
        name: this.format3DLabel('proj_v u', proj)
      });

      dataTraces.push({
        type: 'scatter3d',
        mode: 'lines+markers+text',
        x: [0, rej.x],
        y: [0, rej.y],
        z: [0, rej.z],
        line: { color: '#a855f7', width: 8, dash: 'dash' },
        marker: { size: [0, 7], color: '#a855f7' },
        text: ['', 'ort_v u'],
        textposition: 'top center',
        name: this.format3DLabel('ort_v u', rej)
      });
    }

    const layout = {
      autosize: true,
      height: 400,
      margin: { l: 0, r: 0, b: 0, t: 0 },
      paper_bgcolor: '#0f172a',
      plot_bgcolor: '#0f172a',
      scene: {
        aspectmode: 'cube',
        xaxis: { title: 'X', backgroundcolor: '#1e293b', gridcolor: '#334155', showbackground: true, zerolinecolor: '#64748b' },
        yaxis: { title: 'Y', backgroundcolor: '#1e293b', gridcolor: '#334155', showbackground: true, zerolinecolor: '#64748b' },
        zaxis: { title: 'Z', backgroundcolor: '#1e293b', gridcolor: '#334155', showbackground: true, zerolinecolor: '#64748b' }
      },
      legend: {
        font: { color: '#cbd5e1' },
        x: 0,
        y: 1
      }
    };

    const config = { responsive: true, displayModeBar: false };

    Plotly.newPlot(this.plotly3DRef.nativeElement, dataTraces, layout, config);
  }
}
