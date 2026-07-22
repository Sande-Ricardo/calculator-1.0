import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-block-viewer-callout',
  templateUrl: './block-viewer-callout.component.html',
  styleUrls: ['./block-viewer-callout.component.scss']
})
export class BlockViewerCalloutComponent implements OnChanges {
  @Input() content: string = '';
  @Input() metadata: any = {};

  variant: 'definition' | 'theorem' | 'warning' = 'definition';
  title: string = '';
  parsedHtml: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (this.metadata) {
      this.variant = this.metadata.variant || 'definition';
      this.title = this.metadata.title || this.getDefaultTitle(this.variant);
    }
    if (changes['content']) {
      this.parsedHtml = this.parseMarkdown(this.content);
    }
  }

  private getDefaultTitle(variant: string): string {
    switch (variant) {
      case 'theorem': return 'Theorem / Formula';
      case 'warning': return 'Warning / Common Pitfall';
      case 'definition':
      default:
        return 'Definition';
    }
  }

  private parseMarkdown(md: string): string {
    if (!md) return '';
    let html = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    return html.replace(/\n/g, '<br>');
  }
}
