import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CourseBlock } from 'src/app/interfaces/Course';

export interface GraphVariable {
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
}

@Component({
  selector: 'app-block-editor-graph',
  templateUrl: './block-editor-graph.component.html',
  styleUrls: ['./block-editor-graph.component.scss']
})
export class BlockEditorGraphComponent implements OnInit {
  @Input() block!: CourseBlock;
  @Output() blockChange = new EventEmitter<CourseBlock>();

  ngOnInit(): void {
    if (!this.block.metadata) {
      this.block.metadata = { title: '', variables: [] };
    }
    if (!Array.isArray(this.block.metadata.variables)) {
      this.block.metadata.variables = [];
    }
  }

  onTitleChange(title: string): void {
    const updated = {
      ...this.block,
      metadata: { ...this.block.metadata, title }
    };
    this.blockChange.emit(updated);
  }

  onEquationChange(content: string): void {
    const updated = { ...this.block, content };
    this.blockChange.emit(updated);
  }

  addVariable(): void {
    const vars: GraphVariable[] = [...(this.block.metadata?.variables || [])];
    vars.push({
      name: 'A',
      min: -10,
      max: 10,
      step: 0.1,
      value: 1
    });

    const updated = {
      ...this.block,
      metadata: { ...this.block.metadata, variables: vars }
    };
    this.blockChange.emit(updated);
  }

  removeVariable(index: number): void {
    const vars: GraphVariable[] = [...(this.block.metadata?.variables || [])];
    vars.splice(index, 1);

    const updated = {
      ...this.block,
      metadata: { ...this.block.metadata, variables: vars }
    };
    this.blockChange.emit(updated);
  }

  updateVariable(index: number, key: keyof GraphVariable, value: any): void {
    const vars: GraphVariable[] = [...(this.block.metadata?.variables || [])];
    vars[index] = {
      ...vars[index],
      [key]: key === 'name' ? String(value) : Number(value)
    };

    const updated = {
      ...this.block,
      metadata: { ...this.block.metadata, variables: vars }
    };
    this.blockChange.emit(updated);
  }
}
