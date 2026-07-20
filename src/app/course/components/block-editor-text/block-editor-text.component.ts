import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CourseBlock } from 'src/app/interfaces/Course';

@Component({
  selector: 'app-block-editor-text',
  templateUrl: './block-editor-text.component.html',
  styleUrls: ['./block-editor-text.component.scss']
})
export class BlockEditorTextComponent {
  @Input() block!: CourseBlock;
  @Output() blockChange = new EventEmitter<CourseBlock>();

  onContentChange(value: string): void {
    const updated = { ...this.block, content: value };
    this.blockChange.emit(updated);
  }
}
