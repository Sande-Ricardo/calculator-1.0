import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseBlock } from 'src/app/interfaces/Course';

@Component({
  selector: 'app-block-editor-latex',
  templateUrl: './block-editor-latex.component.html',
  styleUrls: ['./block-editor-latex.component.scss']
})
export class BlockEditorLatexComponent {
  @Input() block!: CourseBlock;
  @Output() blockChange = new EventEmitter<CourseBlock>();

  onContentChange(value: string): void {
    const updated = { ...this.block, content: value };
    this.blockChange.emit(updated);
  }
}
