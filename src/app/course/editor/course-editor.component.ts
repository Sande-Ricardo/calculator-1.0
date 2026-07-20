import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course, CourseBlock, BlockType } from 'src/app/interfaces/Course';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-course-editor',
  templateUrl: './course-editor.component.html',
  styleUrls: ['./course-editor.component.scss']
})
export class CourseEditorComponent implements OnInit, OnDestroy {
  courseCopy: Course | null = null;
  private sub!: Subscription;

  constructor(
    private courseService: CourseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sub = this.courseService.getCourse().subscribe({
      next: (course) => {
        if (course && !this.courseCopy) {
          // Perform a deep copy of the course data to edit locally
          this.courseCopy = JSON.parse(JSON.stringify(course));
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  updateBlock(index: number, updatedBlock: CourseBlock): void {
    if (!this.courseCopy) return;
    this.courseCopy.blocks[index] = updatedBlock;
  }

  addBlock(type: BlockType): void {
    if (!this.courseCopy) return;
    
    const newBlock: CourseBlock = {
      id: `block_${Date.now()}`,
      type: type,
      content: '',
      metadata: type === 'image' ? { caption: '' } : type === 'link' ? { label: '' } : undefined
    };

    // Pre-populate placeholders
    if (type === 'text') {
      newBlock.content = '## New Heading\nWrite text here...';
    } else if (type === 'latex') {
      newBlock.content = 'f(x) = x^2';
    }

    this.courseCopy.blocks.push(newBlock);
  }

  deleteBlock(index: number): void {
    if (!this.courseCopy) return;
    this.courseCopy.blocks.splice(index, 1);
  }

  moveBlock(index: number, direction: 'up' | 'down'): void {
    if (!this.courseCopy) return;
    const blocks = this.courseCopy.blocks;
    
    if (direction === 'up' && index > 0) {
      const temp = blocks[index];
      blocks[index] = blocks[index - 1];
      blocks[index - 1] = temp;
    } else if (direction === 'down' && index < blocks.length - 1) {
      const temp = blocks[index];
      blocks[index] = blocks[index + 1];
      blocks[index + 1] = temp;
    }
  }

  save(): void {
    if (this.courseCopy) {
      this.courseService.updateCourse(this.courseCopy);
    }
    this.router.navigate(['/course']);
  }

  cancel(): void {
    this.router.navigate(['/course']);
  }
}
