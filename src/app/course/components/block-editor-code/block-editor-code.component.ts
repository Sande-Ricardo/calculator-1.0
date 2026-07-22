import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseBlock } from 'src/app/interfaces/Course';

@Component({
  selector: 'app-block-editor-code',
  templateUrl: './block-editor-code.component.html',
  styleUrls: ['./block-editor-code.component.scss']
})
export class BlockEditorCodeComponent implements OnInit {
  @Input() block!: CourseBlock;
  @Output() blockChange = new EventEmitter<CourseBlock>();

  ngOnInit(): void {
    if (!this.block.metadata) {
      this.block.metadata = { language: 'python' };
    }
  }

  onContentChange(content: string): void {
    this.emitUpdate({ content });
  }

  onLanguageChange(language: string): void {
    this.emitUpdate({ metadata: { ...this.block.metadata, language } });
  }

  private emitUpdate(changes: Partial<CourseBlock>): void {
    const updated = { ...this.block, ...changes };
    this.blockChange.emit(updated);
  }
}
