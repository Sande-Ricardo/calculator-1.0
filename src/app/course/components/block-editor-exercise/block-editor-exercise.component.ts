import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseBlock } from 'src/app/interfaces/Course';

@Component({
  selector: 'app-block-editor-exercise',
  templateUrl: './block-editor-exercise.component.html',
  styleUrls: ['./block-editor-exercise.component.scss']
})
export class BlockEditorExerciseComponent implements OnInit {
  @Input() block!: CourseBlock;
  @Output() blockChange = new EventEmitter<CourseBlock>();

  ngOnInit(): void {
    if (!this.block.metadata) {
      this.block.metadata = { 
        type: 'choice',
        options: ['Option A', 'Option B'],
        correctIndex: 0,
        feedback: ''
      };
    }
  }

  onQuestionChange(content: string): void {
    this.emitUpdate({ content });
  }

  onTypeChange(type: 'choice' | 'symbolic'): void {
    const defaultMeta = type === 'choice' 
      ? { options: ['Option A', 'Option B'], correctIndex: 0, feedback: '' }
      : { correctExpression: 'x^2', feedback: '' };

    this.emitUpdate({ 
      metadata: { ...this.block.metadata, type, ...defaultMeta } 
    });
  }

  // Type A (Choice) Handlers
  addOption(): void {
    const options = [...(this.block.metadata.options || [])];
    options.push(`Option ${options.length + 1}`);
    this.emitUpdate({ metadata: { ...this.block.metadata, options } });
  }

  removeOption(index: number): void {
    const options = [...(this.block.metadata.options || [])];
    options.splice(index, 1);
    
    // Adjust correctIndex if needed
    let correctIndex = this.block.metadata.correctIndex;
    if (correctIndex === index) {
      correctIndex = 0; // Reset to 0 if the correct one was removed
    } else if (correctIndex > index) {
      correctIndex--; // Shift index down
    }

    this.emitUpdate({ metadata: { ...this.block.metadata, options, correctIndex } });
  }

  updateOption(index: number, value: string): void {
    const options = [...(this.block.metadata.options || [])];
    options[index] = value;
    this.emitUpdate({ metadata: { ...this.block.metadata, options } });
  }

  setCorrectIndex(index: number): void {
    this.emitUpdate({ metadata: { ...this.block.metadata, correctIndex: index } });
  }

  // Type B (Symbolic) Handlers
  onCorrectExpressionChange(expr: string): void {
    this.emitUpdate({ metadata: { ...this.block.metadata, correctExpression: expr } });
  }

  onFeedbackChange(feedback: string): void {
    this.emitUpdate({ metadata: { ...this.block.metadata, feedback } });
  }

  private emitUpdate(changes: Partial<CourseBlock>): void {
    const updated = { ...this.block, ...changes };
    this.blockChange.emit(updated);
  }
}
