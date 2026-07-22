import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseBlock } from 'src/app/interfaces/Course';

@Component({
  selector: 'app-block-editor-callout',
  templateUrl: './block-editor-callout.component.html',
  styleUrls: ['./block-editor-callout.component.scss']
})
export class BlockEditorCalloutComponent implements OnInit {
  @Input() block!: CourseBlock;
  @Output() blockChange = new EventEmitter<CourseBlock>();

  ngOnInit(): void {
    if (!this.block.metadata) {
      this.block.metadata = { variant: 'definition', title: '' };
    }
  }

  onVariantChange(variant: string): void {
    const updated = {
      ...this.block,
      metadata: { ...this.block.metadata, variant }
    };
    this.blockChange.emit(updated);
  }

  onTitleChange(title: string): void {
    const updated = {
      ...this.block,
      metadata: { ...this.block.metadata, title }
    };
    this.blockChange.emit(updated);
  }

  onContentChange(content: string): void {
    const updated = { ...this.block, content };
    this.blockChange.emit(updated);
  }
}
