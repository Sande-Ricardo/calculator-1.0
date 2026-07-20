import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseBlock } from 'src/app/interfaces/Course';

@Component({
  selector: 'app-block-editor-image',
  templateUrl: './block-editor-image.component.html',
  styleUrls: ['./block-editor-image.component.scss']
})
export class BlockEditorImageComponent implements OnInit {
  @Input() block!: CourseBlock;
  @Output() blockChange = new EventEmitter<CourseBlock>();

  ngOnInit(): void {
    // Ensure metadata exists
    if (!this.block.metadata) {
      this.block.metadata = { caption: '' };
    }
  }

  onUrlChange(value: string): void {
    const updated = { ...this.block, content: value };
    this.blockChange.emit(updated);
  }

  onCaptionChange(value: string): void {
    const updated = {
      ...this.block,
      metadata: { ...this.block.metadata, caption: value }
    };
    this.blockChange.emit(updated);
  }
}
