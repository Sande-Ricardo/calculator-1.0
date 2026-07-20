import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-block-viewer-latex',
  templateUrl: './block-viewer-latex.component.html',
  styleUrls: ['./block-viewer-latex.component.scss']
})
export class BlockViewerLatexComponent {
  @Input() content: string = '';
}
