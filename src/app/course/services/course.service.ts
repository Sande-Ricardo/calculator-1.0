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
        id: 'b1_callout',
        type: 'callout',
        content: 'An **Ordinary Differential Equation (ODE)** is an equation involving an unknown function $y(x)$ and one or more of its derivatives with respect to a single independent variable $x$.',
        metadata: { variant: 'definition', title: 'Fundamental Definition' }
      },
      {
        id: 'b2',
        type: 'latex',
        content: '\\frac{dy}{dx} = f(x, y)'
      },
      {
        id: 'b2_theorem',
        type: 'callout',
        content: 'If $f(x, y)$ and $\\frac{\\partial f}{\\partial y}$ are continuous on a rectangle $R$, then there exists a unique solution $y(x)$ passing through any initial point $(x_0, y_0) \\in R$.',
        metadata: { variant: 'theorem', title: 'Existence and Uniqueness Theorem' }
      },
      {
        id: 'b3',
        type: 'text',
        content: '### Slope Fields (Direction Fields)\n\nWhen an analytical solution is difficult to find, we can visualize the behavior of the differential equation using a **Slope Field**. At every point $(x, y)$ in the plane, we draw a small line segment whose slope is equal to the derivative $dy/dx$. This gives us a geometric view of all potential solution curves.'
      },
      {
        id: 'b3_warning',
        type: 'callout',
        content: 'Do not confuse slope field direction segments with vector fields that indicate magnitude! Slope field segments represent **only the tangent slope** $dy/dx$ and have a fixed unit length.',
        metadata: { variant: 'warning', title: 'Common Student Misconception' }
      },
      {
        id: 'b3_graph',
        type: 'graph',
        content: 'y = A \\sin(B x)',
        metadata: {
          title: 'Interactive Wave Exploration: Amplitude (A) & Frequency (B)',
          variables: [
            { name: 'A', min: -5, max: 5, step: 0.1, value: 2 },
            { name: 'B', min: 0.5, max: 8, step: 0.1, value: 1.5 }
          ]
        }
      },
      {
        id: 'b4',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
        metadata: { caption: 'Visualizing calculus concepts and patterns geometrically.' }
      },
      {
        id: 'b4_quiz',
        type: 'exercise',
        content: '**Concept Check**\n\nIf the slope field of an ODE shows horizontal tangent lines along the x-axis, what does this imply about the derivative at $y=0$?',
        metadata: {
          type: 'choice',
          options: ['The derivative is $1$', 'The derivative is $0$', 'The derivative is undefined', 'The function is undefined'],
          correctIndex: 1,
          feedback: 'Correct! Horizontal tangent lines have a slope of zero, meaning $dy/dx = 0$.'
        }
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
        id: 'b6_symbolic',
        type: 'exercise',
        content: 'Evaluate the general solution of the ODE above manually. Enter your solution for $y(x)$ (excluding the constant of integration for simplicity):',
        metadata: {
          type: 'symbolic',
          correctExpression: '\\frac{1}{3}e^x',
          feedback: 'Excellent! Using the integrating factor method, we arrive at this exact form.'
        }
      },
      {
        id: 'b7',
        type: 'link',
        content: '/ode',
        metadata: { label: 'Go to ODE Solver Tool' }
      },
      {
        id: 'b8',
        type: 'code',
        content: 'def runge_kutta(f, y0, t0, t_max, dt):\n    t = np.arange(t0, t_max, dt)\n    y = np.zeros(len(t))\n    y[0] = y0\n    \n    for i in range(1, len(t)):\n        k1 = dt * f(t[i-1], y[i-1])\n        k2 = dt * f(t[i-1] + dt/2, y[i-1] + k1/2)\n        k3 = dt * f(t[i-1] + dt/2, y[i-1] + k2/2)\n        k4 = dt * f(t[i-1] + dt, y[i-1] + k3)\n        y[i] = y[i-1] + (k1 + 2*k2 + 2*k3 + k4) / 6\n        \n    return t, y',
        metadata: { language: 'python' }
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
