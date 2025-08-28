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
      // Esperar al siguiente ciclo de detección para asegurar que el HTML ya está en el DOM
      setTimeout(() => {
        window.MathJax.typesetPromise([this.mathContainer.nativeElement]);
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

  // constructor(private el: ElementRef) { }


  // @Input() expression: string = '';

  // private renderMathJax() {
  //   if (window.MathJax) {
  //     window.MathJax.typesetPromise([this.el.nativeElement]);
  //   }
  // }

  // ngAfterViewInit() {
  //   this.renderMathJax();
  // }
  // ngOnChanges() {
  //   this.renderMathJax();
  // }

}
