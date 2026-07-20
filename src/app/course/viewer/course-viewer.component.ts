import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from 'src/app/interfaces/Course';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-course-viewer',
  templateUrl: './course-viewer.component.html',
  styleUrls: ['./course-viewer.component.scss']
})
export class CourseViewerComponent implements OnInit, OnDestroy {
  course: Course | null = null;
  private sub!: Subscription;

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.sub = this.courseService.getCourse().subscribe({
      next: (course) => {
        this.course = course;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  resetMock(): void {
    this.courseService.resetCourse();
  }
}
