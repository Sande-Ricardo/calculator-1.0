import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import 'mathlive';

@Component({
  selector: 'app-block-viewer-exercise',
  templateUrl: './block-viewer-exercise.component.html',
  styleUrls: ['./block-viewer-exercise.component.scss']
})
export class BlockViewerExerciseComponent implements OnChanges, AfterViewInit {
  @Input() content: string = ''; // The question text (markdown)
  @Input() metadata: any = {};   // { type: 'choice' | 'symbolic', options: string[], correctIndex?: number, correctExpression?: string, feedback?: string }

  // State
  selectedOptionIndex: number | null = null;
  mathInputValue: string = '';
  
  hasSubmitted: boolean = false;
  isCorrect: boolean = false;

  @ViewChild('mathField') mathField!: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['metadata'] || changes['content']) {
      this.resetState();
    }
  }

  ngAfterViewInit(): void {
    if (this.metadata?.type === 'symbolic' && this.mathField) {
      // Listen to input changes from mathlive component
      this.mathField.nativeElement.addEventListener('input', (ev: any) => {
        this.mathInputValue = ev.target.value;
      });
    }
  }

  resetState(): void {
    this.selectedOptionIndex = null;
    this.mathInputValue = '';
    this.hasSubmitted = false;
    this.isCorrect = false;
  }

  selectOption(index: number): void {
    if (this.hasSubmitted) return;
    this.selectedOptionIndex = index;
  }

  submitAnswer(): void {
    if (this.metadata?.type === 'choice') {
      if (this.selectedOptionIndex === null) return;
      this.isCorrect = this.selectedOptionIndex === this.metadata.correctIndex;
      this.hasSubmitted = true;
    } else if (this.metadata?.type === 'symbolic') {
      if (!this.mathInputValue) return;
      
      // Provisorio: Client-side mock evaluation for symbolic equivalence
      // In a real scenario, we would send this to the SymPy backend endpoint
      const normalizedInput = this.mathInputValue.replace(/\s/g, '');
      const normalizedTarget = (this.metadata.correctExpression || '').replace(/\s/g, '');
      
      this.isCorrect = normalizedInput === normalizedTarget;
      this.hasSubmitted = true;
    }
  }
}
