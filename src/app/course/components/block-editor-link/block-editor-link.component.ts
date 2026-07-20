import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseBlock } from 'src/app/interfaces/Course';

@Component({
  selector: 'app-block-editor-link',
  templateUrl: './block-editor-link.component.html',
  styleUrls: ['./block-editor-link.component.scss']
})
export class BlockEditorLinkComponent implements OnInit {
  @Input() block!: CourseBlock;
  @Output() blockChange = new EventEmitter<CourseBlock>();

  ngOnInit(): void {
    // Ensure metadata exists
    if (!this.block.metadata) {
      this.block.metadata = { label: '' };
    }
  }

  onUrlChange(value: string): void {
    const updated = { ...this.block, content: value };
    this.blockChange.emit(updated);
  }

  onLabelChange(value: string): void {
    const updated = {
      ...this.block,
      metadata: { ...this.block.metadata, label: value }
    };
    this.blockChange.emit(updated);
  }
}
