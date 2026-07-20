import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-block-viewer-text',
  templateUrl: './block-viewer-text.component.html',
  styleUrls: ['./block-viewer-text.component.scss']
})
export class BlockViewerTextComponent implements OnChanges {
  @Input() content: string = '';
  parsedHtml: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      this.parsedHtml = this.parseMarkdown(this.content);
    }
  }

  private parseMarkdown(md: string): string {
    if (!md) return '';
    
    // Process markdown line-by-line or with global replacements
    let html = md;

    // 1. Escape basic HTML tags to prevent layout break/XSS
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 2. Headers
    html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');

    // 3. Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // 4. Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // 5. Unordered List Items
    html = html.replace(/^\-\s+(.+)$/gm, '<li>$1</li>');
    // Group sequential <li> items into <ul>
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    // Fix multiple adjacent <ul> tags
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // 6. Paragraphs and newlines
    const paragraphs = html.split(/\n{2,}/);
    const processed = paragraphs.map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      // Don't wrap in <p> if it's already a block tag
      if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li')) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    });

    return processed.filter(x => x !== '').join('\n');
  }
}
