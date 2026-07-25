import { Component, Input } from '@angular/core';
import { MagnitudeDefinition } from '../../models/converter.model';

@Component({
  selector: 'app-dimensional-inspector',
  templateUrl: './dimensional-inspector.component.html',
  styleUrls: ['./dimensional-inspector.component.scss']
})
export class DimensionalInspectorComponent {
  @Input() magnitude!: MagnitudeDefinition;
}
