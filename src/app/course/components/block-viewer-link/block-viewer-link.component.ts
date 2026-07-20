import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-block-viewer-link',
  templateUrl: './block-viewer-link.component.html',
  styleUrls: ['./block-viewer-link.component.scss']
})
export class BlockViewerLinkComponent implements OnInit {
  @Input() content: string = '';
  @Input() metadata: any = {};

  isInternal: boolean = false;

  ngOnInit(): void {
    this.checkLinkType();
  }

  ngOnChanges(): void {
    this.checkLinkType();
  }

  private checkLinkType(): void {
    this.isInternal = this.content ? this.content.startsWith('/') : false;
  }
}
