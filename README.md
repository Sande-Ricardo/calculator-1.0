# Calculator - Angular Client

A comprehensive Angular-based mathematical calculation platform designed to provide advanced computational capabilities through an intuitive web interface. This client application serves as the frontend component of the broader Calculato ecosystem, offering features for derivatives, integrals, equation solving, graphing, matrix operations, financial mathematics, unit conversion, expression evaluation, and statistical analysis.

## Overview

Calculator is a feature-rich Angular 14 application built with TypeScript, leveraging modern mathematical libraries to deliver precise calculations and visualizations. The application follows a modular architecture with lazy-loaded feature modules, ensuring optimal performance and maintainability.

### Key Features

- **Basic and Scientific Calculation:** Standard and scientific calculation modes with real-time evaluation.
- **Derivative Computation:** Symbolic and numerical derivative computation with step-by-step analysis.
- **Integral Operations:** Definite and indefinite integration tools.
- **Equation Solving:** Polynomial and systems of linear equations solver.
- **Graph Plotting & Visualization:** 2D function graphing powered by Desmos API integration.
- **Matrix Operations:** Matrix arithmetic, determinants, inverses, eigenvalues, and linear algebra solvers.
- **Statistical Analysis & Modeling:** Descriptive statistics, dispersion metrics, outliers detection, and continuous/discrete probability distributions (Normal, Student-t, Binomial, Poisson).
- **Differential Equations (ODE):** Analytical ordinary differential equations solver and interactive slope fields visualizer.
- **Unit Converter:** Real-time conversion across physical quantities (length, mass, temperature, time, volume, speed, energy, pressure) and digital data storage.
- **Financial Mathematics:** Simple and compound interest calculators, loan amortization schedule generators (French, German, American systems) with CSV/PDF exports, and investment project evaluation (NPV & IRR).
- **Expression Evaluator & Interpreter:** Client-side mathematical AST sandbox with MathJax LaTeX rendering, live variable extraction with interactive sliders, 1D function plot preview, and hybrid interval sampling multi-root finder ($f(x) = 0$).
- **Course Materials:** Educational resources and learning materials.
- **Modern Responsive UI:** Glassmorphism design system, responsive navigation drawer, mobile-optimized viewports, and clean UI components without emoji dependencies.

## Project Context

> [!NOTE]
> This is a subproject of **Calculato**. For the complete documentation, setup guides, and overall architecture, please refer to the main repository:
>
> [Main API Gateway README](https://github.com/Sande-Ricardo/calculato-rest_api)

This frontend application integrates with the Calculato REST API backend to provide complete mathematical computation capabilities.

## Technology Stack

### Core Framework and Libraries

| Technology | Version | Purpose |
|-----------|---------|---------|
| Angular | 14.0.x | Frontend framework |
| TypeScript | 4.7.2 | Programming language |
| RxJS | 7.5.x | Reactive programming |
| Angular Router | 14.0.x | Client-side routing with lazy loading |
| Angular Forms | 14.0.x | Reactive and template-driven form validation |

### Mathematical and Visualization Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| mathjs | 15.1.0 | Mathematical expression parsing, AST evaluation, and symbolic differentiation |
| mathjax-full | 3.2.2 | LaTeX and mathematical notation rendering |
| Chart.js | 4.x | Interactive 2D data plotting and probability curve visualization |
| Desmos API | Latest | Interactive 2D function graphing and coordinate grid canvas |

### Build and Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Angular CLI | 14.0.2 | Development server and build automation |
| pnpm | 8.x+ | Enforced package manager |
| Karma | 6.3.0 | Unit test runner |
| Jasmine | 4.1.0 | Testing framework |
| TypeScript Compiler | 4.7.2 | TypeScript compilation |

## Project Structure

```
calculator-1.0/
├── src/
│   ├── app/
│   │   ├── calculator/              # Basic & scientific calculator module
│   │   ├── derivation/              # Derivative calculations module
│   │   ├── integration/             # Integration calculations module
│   │   ├── course/                  # Educational course materials module
│   │   ├── equation/                # Equation solving module
│   │   ├── graphing/                # Desmos 2D graph plotting & visualization
│   │   ├── matrix/                  # Matrix operations & linear algebra
│   │   ├── stats/                   # Statistics & probability distributions
│   │   ├── ode/                     # ODE solver & slope fields visualizer
│   │   ├── converter/               # Physical & digital unit converter module
│   │   ├── financial-math/          # Financial math (Interest, Amortization, NPV/IRR)
│   │   ├── evaluator/               # In-browser AST evaluator & root finder
│   │   ├── components/              # Shared UI components
│   │   │   ├── standard-calculator/ # Standard calculator interface
│   │   │   ├── top-menu/            # Navigation header bar
│   │   │   └── function-viewer/     # LaTeX math rendering wrapper
│   │   ├── core/                    # Core application services & layout
│   │   │   ├── services/            # Layout and API management services
│   │   │   └── layout/
│   │   │       ├── main-layout/     # Main layout wrapper & router container
│   │   │       └── side-menu/       # Responsive navigation drawer
│   │   ├── interfaces/              # TypeScript interfaces and data models
│   │   ├── shared/                  # Shared utilities and reusable pipes
│   │   ├── app.module.ts            # Root application module
│   │   ├── app-routing.module.ts    # Central lazy-loaded routing module
│   │   └── app.component.ts         # Root component
│   ├── assets/                      # Static assets (images, icons)
│   ├── environments/                # Environment configuration files
│   ├── styles.scss                  # Global SCSS styling & design tokens
│   ├── main.ts                      # Application entry point
│   ├── index.html                   # HTML template
│   └── polyfills.ts                 # Browser compatibility polyfills
├── dist/                            # Build output directory
├── angular.json                     # Angular CLI configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and npm/pnpm scripts
└── README.md                        # Project documentation
```

## Module Architecture

The application implements a feature-based modular structure with lazy-loaded Angular modules for optimal initial bundle sizes:

### Feature Modules

- **CalculatorModule (`/`)**: Standard and scientific arithmetic calculator with angle unit toggles (DEG/RAD).
- **DerivationModule (`/derivate`)**: Symbolic derivative evaluation, step-by-step breakdown, and rate-of-change analysis.
- **IntegrationModule (`/integrate`)**: Definite and indefinite integrals computation with step-by-step normalizer.
- **EquationModule (`/equation`)**: Polynomial equation solver and linear equation systems solver ($N \times N$).
- **GraphingModule (`/graph`)**: Interactive 2D graph canvas powered by Desmos API with multi-function expression tracking.
- **MatrixModule (`/matrix`)**: Matrix algebra (Addition, Multiplication, Transpose, Determinant, Inverse, Rank, Gaussian Elimination) with scrollable grid inputs.
- **StatsModule (`/stats`)**:
  - *Descriptive Statistics:* Mean, median, mode, variance, standard deviation, quartiles (Q1, Q2, Q3), IQR, and 1.5 IQR outlier detection.
  - *Probability Distributions:* Probability density & cumulative distribution calculations (Normal, Student-t, Binomial, Poisson) with interactive curve plots.
- **OdeModule (`/ode`)**: First-order and second-order Ordinary Differential Equations solver with step-by-step solution algorithms and interactive direction/slope fields visualizer.
- **ConverterModule (`/converter`)**: Unit conversion across physical quantities (Length, Mass, Temperature, Time, Volume, Speed, Energy, Pressure) and digital Data Storage with customizable decimal precision.
- **FinancialMathModule (`/finance`)**:
  - *Interest Calculator:* Simple and compound interest solver with flexible compounding frequencies.
  - *Loan Amortization:* French (constant payment), German (constant principal), and American (interest-only) amortization schedule generators with CSV and PDF print export.
  - *Project Evaluation:* Net Present Value (NPV) and Internal Rate of Return (IRR) investment analysis.
- **EvaluatorModule (`/evaluator`)**: Client-side mathematical sandbox executing entirely in the browser:
  - AST parsing using `mathjs` with syntax error highlighting.
  - Live LaTeX rendering via MathJax.
  - Dynamic Variable Dashboard with auto-detected variables and real-time interactive sliders.
  - 1D function plot preview using Chart.js.
  - Hybrid Numerical Root Finder ($f(x) = 0$) combining bracket sampling and Newton-Raphson refinement with strict residual validation ($|f(r)| < 10^{-5}$).
  - Session history persistence using `localStorage`.
- **CourseModule (`/course`)**: Educational modules and interactive learning materials.

### Layout & Core Components

- **MainLayoutComponent**: Primary layout shell hosting the router outlet, top bar, sidebar drawer, and mobile backdrop.
- **SideMenuComponent**: Categorized navigation sidebar (`Basic Math`, `Algebra & Matrices`, `Calculus`, `Applied Math`) with responsive sliding drawer behavior on mobile viewports.
- **TopMenuComponent**: Top navigation header bar with branding and mobile hamburger toggle button.
- **LayoutService**: RxJS `BehaviorSubject` service managing global responsive layout state and mobile drawer toggles.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (v18 or higher, v20 recommended)
- pnpm (strictly enforced for package management)
- Angular CLI v14 or higher

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Sande-Ricardo/calculator-1.0.git
cd calculator-1.0
```

2. Install dependencies using `pnpm`:

```bash
pnpm install
```

3. Verify installation:

```bash
npx ng version
```

## Development

### Running the Development Server

Start the development server with automatic reloading:

```bash
pnpm start
```

or

```bash
npx ng serve
```

The application will be available at `http://localhost:4200/`. Changes to source files will automatically trigger browser updates.

### Code Generation

Generate new components, services, or modules using Angular CLI:

```bash
# Generate a new component
npx ng generate component component-name

# Generate a new service
npx ng generate service service-name

# Generate a new feature module with routing
npx ng generate module module-name --routing
```

## Building

### Production Build

Create an optimized production build:

```bash
pnpm build
```

or

```bash
npx ng build
```

Build artifacts will be stored in the `dist/` directory. The build includes:

- Minified JavaScript and CSS bundles
- Tree-shaking for unused code elimination
- Ahead-of-Time (AOT) compilation
- Cache-busting output hashing

### Development Build

Generate a development build with source maps enabled:

```bash
npx ng build --configuration development
```

## Testing

### Unit Tests

Execute unit tests using Karma and Jasmine:

```bash
pnpm test
```

or

```bash
npx ng test
```

### Coverage Reports

Generate test code coverage reports:

```bash
npx ng test --code-coverage
```

Coverage reports are saved in the `coverage/` directory (`coverage/index.html`).

## Styling & Responsive Design System

### SCSS & Glassmorphism Tokens

Styles are built using SCSS with global CSS custom properties defined in `src/styles.scss`:

- **Design System:** Glassmorphism backdrop filters (`backdrop-filter: blur()`), glowing borders, and curated dark palette (`#0e0f25`, `#1e293b`, `#3b82f6`).
- **Responsive Layout:** All modules implement responsive flexbox and CSS grid layouts with mobile breakpoints (`@media (max-width: 768px)`).
- **Overflow Protection:** Global horizontal overflow protection (`overflow-x: hidden`) with scrollable inner containers for wide data tables and matrix grids.
- **Typography & Icons:** Modern web fonts (`Inter`, `JetBrains Mono`) and SVG icons without emoji dependencies.

## Browser Support

The application targets modern web browsers with ES2020 support:

- Google Chrome (latest)
- Mozilla Firefox (latest)
- Apple Safari (latest)
- Microsoft Edge (latest)

## Related Repositories

- [Calculato REST API](https://github.com/Sande-Ricardo/calculato-rest_api) - Main backend API gateway

## License

Refer to the repository for license information.

---

Last Updated: August 2026
