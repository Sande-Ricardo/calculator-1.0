import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

declare global {
  interface Window {
    MathJax: any;
  }
}

@Component({
  selector: 'app-mathjax-viewer',
  template: `<div #mathContainer [innerHTML]="expression"></div>`,
  standalone: true,
  // styleUrls: ['./mathjax-viewer.component.scss']
})
export class MathjaxViewerComponent implements AfterViewInit, OnChanges {


  @Input() expression: string = '';
  @ViewChild('mathContainer', { static: true }) mathContainer!: ElementRef;

  private renderMathJax() {
    if (window.MathJax) {
      // Wait for the next detection cycle to ensure that the HTML is already in the DOM
      setTimeout(() => {
        window.MathJax.typesetPromise([this.mathContainer.nativeElement]);
        console.log("Intentando renderizar");
        
      });
    }
  }

  ngAfterViewInit() {
    this.renderMathJax();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['expression'] && !changes['expression'].firstChange) {
      this.renderMathJax();
    }
  }

}
