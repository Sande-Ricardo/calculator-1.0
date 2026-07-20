import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-block-viewer-image',
  templateUrl: './block-viewer-image.component.html',
  styleUrls: ['./block-viewer-image.component.scss']
})
export class BlockViewerImageComponent {
  @Input() content: string = '';
  @Input() metadata: any = {};
}
