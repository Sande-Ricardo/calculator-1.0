import { Component, OnInit } from '@angular/core';
import { FunctionViewerComponent } from '../function-viewer/function-viewer.component';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  imports: [FunctionViewerComponent],
  standalone: true
})
export class GraphComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
