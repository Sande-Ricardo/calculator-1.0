import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import hljs from 'highlight.js';

@Component({
  selector: 'app-block-viewer-code',
  templateUrl: './block-viewer-code.component.html',
  styleUrls: ['./block-viewer-code.component.scss']
})
export class BlockViewerCodeComponent implements OnChanges, AfterViewInit {
  @Input() content: string = ''; // The code string
  @Input() metadata: any = {};   // { language: 'python' | 'cpp' | 'matlab' }
  
  @ViewChild('codeElement') codeElement!: ElementRef;

  isCopied = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content'] || changes['metadata']) {
      this.highlightCode();
    }
  }

  ngAfterViewInit(): void {
    this.highlightCode();
  }

  highlightCode(): void {
    if (this.codeElement && this.content) {
      const codeNode = this.codeElement.nativeElement;
      codeNode.textContent = this.content;
      
      const lang = this.metadata?.language || 'python';
      codeNode.className = `language-${lang}`;
      
      hljs.highlightElement(codeNode);
    }
  }

  copyToClipboard(): void {
    if (!this.content) return;
    navigator.clipboard.writeText(this.content).then(() => {
      this.isCopied = true;
      setTimeout(() => this.isCopied = false, 2000);
    });
  }
}
