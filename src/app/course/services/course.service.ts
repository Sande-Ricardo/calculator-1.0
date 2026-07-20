import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course, CourseBlock } from 'src/app/interfaces/Course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private initialMock: Course = {
    id: 101,
    title: 'Differential Equations & Slope Fields',
    description: 'Learn the fundamentals of Ordinary Differential Equations (ODEs) and how to visualize slope fields.',
    author: {
      name: 'Dr. Sarah Sterling',
      bio: 'Professor of Applied Mathematics with 15+ years of teaching experience.'
    },
    blocks: [
      {
        id: 'b1',
        type: 'text',
        content: '# Introduction to ODEs\n\nAn ordinary differential equation (ODE) is an equation containing one or more functions of one independent variable and its derivatives. They are extremely useful in modeling physical phenomena such as population growth, cooling processes, and mechanical oscillations.'
      },
      {
        id: 'b2',
        type: 'latex',
        content: '\\frac{dy}{dx} = f(x, y)'
      },
      {
        id: 'b3',
        type: 'text',
        content: '### Slope Fields (Direction Fields)\n\nWhen an analytical solution is difficult to find, we can visualize the behavior of the differential equation using a **Slope Field**. At every point $(x, y)$ in the plane, we draw a small line segment whose slope is equal to the derivative $dy/dx$. This gives us a geometric view of all potential solution curves.'
      },
      {
        id: 'b4',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
        metadata: { caption: 'Visualizing calculus concepts and patterns geometrically.' }
      },
      {
        id: 'b5',
        type: 'text',
        content: '### Interactive Solver\n\nYou can use Calculato\'s ODE module to solve differential equations analytically or visualize their vector slope fields interactively. Try solving the following differential equation:'
      },
      {
        id: 'b6',
        type: 'latex',
        content: 'y\' + 2y = e^x'
      },
      {
        id: 'b7',
        type: 'link',
        content: '/ode',
        metadata: { label: 'Go to ODE Solver & Slope Field Plotter' }
      }
    ]
  };

  private courseSubject = new BehaviorSubject<Course>(JSON.parse(JSON.stringify(this.initialMock)));

  constructor() {}

  getCourse(): Observable<Course> {
    return this.courseSubject.asObservable();
  }

  getCurrentCourseValue(): Course {
    return this.courseSubject.value;
  }

  updateCourse(updatedCourse: Course): void {
    // Perform copy to prevent references binding
    this.courseSubject.next(JSON.parse(JSON.stringify(updatedCourse)));
  }

  resetCourse(): void {
    this.courseSubject.next(JSON.parse(JSON.stringify(this.initialMock)));
  }
}
