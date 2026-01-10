import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SubstepsNode } from 'src/app/interfaces/Derivation';
import { MathjaxViewerComponent } from '../mathjax-viewer/mathjax-viewer.component';

@Component({
  selector: 'app-step-view-derivative',
  templateUrl: './step-view-derivative.component.html',
  styleUrls: ['./step-view-derivative.component.scss'],
  imports: [CommonModule, MathjaxViewerComponent,StepViewDerivativeComponent],
  standalone: true
})
export class StepViewDerivativeComponent implements OnInit {

  @Input() steps!: SubstepsNode[];

  constructor() { }

  ngOnInit(): void {
  }

}
