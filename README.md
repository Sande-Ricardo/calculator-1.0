# Calculator - Angular Client

A comprehensive Angular-based mathematical calculation platform designed to provide advanced computational capabilities through an intuitive web interface. This client application serves as the frontend component of the broader Calculato ecosystem, offering features for derivatives, integrals, equation solving, graphing, and matrix operations.

## Overview

Calculator is a feature-rich Angular 14 application built with TypeScript, leveraging modern mathematical libraries to deliver precise calculations and visualizations. The application follows a modular architecture with lazy-loaded feature modules, ensuring optimal performance and maintainability.

### Key Features

- Basic and advanced calculation operations
- Derivative computation and analysis
- Integral and integration operations
- Equation solving and manipulation
- Graph plotting and visualization (Desmos API integration)
- Matrix operations and linear algebra
- Descriptive statistics and probability distribution modeling
- Analytical ordinary differential equations (ODE) solver
- Comprehensive course materials and learning resources
- Responsive user interface with sidebar navigation and Glassmorphism design
- Real-time calculation updates

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
| Angular Router | 14.0.x | Client-side routing |
| Angular Forms | 14.0.x | Form handling and validation |

### Mathematical Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| mathjs | 15.1.0 | Mathematical expression parsing and evaluation |
| mathjax-full | 3.2.2 | LaTeX and mathematical notation rendering |

### Build and Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Angular CLI | 14.0.2 | Development and build automation |
| Karma | 6.3.0 | Unit test runner |
| Jasmine | 4.1.0 | Testing framework |
| TypeScript Compiler | 4.7.2 | TypeScript compilation |

## Project Structure

```
calculator-1.0/
├── src/
│   ├── app/
│   │   ├── calculator/              # Basic calculator module
│   │   ├── derivation/              # Derivative calculations module
│   │   ├── integration/             # Integration calculations module
│   │   ├── course/                  # Educational course materials
│   │   ├── equation/                # Equation solving module
│   │   ├── graphing/                # Graph plotting and visualization
│   │   ├── matrix/                  # Matrix operations and linear algebra
│   │   ├── stats/                   # Statistics and probability distributions
│   │   ├── ode/                     # Ordinary differential equations solver
│   │   ├── components/              # Shared UI components
│   │   │   ├── scientific/          # Scientific calculator interface
│   │   │   └── top-menu/            # Application header menu
│   │   ├── core/                    # Core application services and layout
│   │   │   └── layout/
│   │   │       ├── main-layout/     # Main layout wrapper
│   │   │       └── side-menu/       # Navigation sidebar
│   │   ├── interfaces/              # TypeScript interfaces and types
│   │   ├── shared/                  # Shared utilities and components
│   │   ├── mocks/                   # Mock data for development
│   │   ├── app.module.ts            # Root application module
│   │   ├── app-routing.module.ts    # Routing configuration
│   │   └── app.component.ts         # Root component
│   ├── assets/                      # Static assets (images, icons)
│   ├── environments/                # Environment configuration files
│   ├── styles.scss                  # Global styling
│   ├── main.ts                      # Application entry point
│   ├── index.html                   # HTML template
│   └── polyfills.ts                 # Browser compatibility polyfills
├── dist/                            # Build output directory
├── angular.json                     # Angular CLI configuration
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.app.json               # TypeScript app-specific config
├── tsconfig.spec.json              # TypeScript testing config
├── karma.conf.js                   # Karma test runner configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

## Module Architecture

The application implements a feature-based module structure with lazy loading for optimal performance:

### Core Modules

- **CalculatorModule**: Basic arithmetic and scientific calculations
- **DerivationModule**: Derivative computation and analysis tools
- **IntegrationModule**: Integration and integral calculations
- **CourseModule**: Educational content and learning materials
- **EquationModule**: Equation solving and manipulation
- **GraphingModule**: Visualization and plotting capabilities
- **MatrixModule**: Matrix operations and linear algebra computations
- **StatsModule**: Descriptive statistics, probability distributions, and statistical analysis
- **OdeModule**: Analytical and numerical ordinary differential equations solver with multiple solution methods

### Layout Components

- **MainLayoutComponent**: Primary application layout wrapper
- **SideMenuComponent**: Navigation sidebar for feature access
- **TopMenuComponent**: Application header with branding
- **ScientificComponent**: Enhanced calculator interface

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

2. Install dependencies:

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

The application will be available at `http://localhost:4200/`. Changes to source files will automatically refresh the application.

### Development Configuration

For development builds with source maps and optimization disabled:

```bash
ng serve --configuration development
```

### Code Generation

Generate new components, services, and other Angular artifacts:

```bash
# Generate a new component
ng generate component component-name

# Generate a new service
ng generate service service-name

# Generate a new module
ng generate module module-name

# Generate a new directive
ng generate directive directive-name

# Generate a new pipe
ng generate pipe pipe-name

# Generate a new class
ng generate class class-name

# Generate a new interface
ng generate interface interface-name
```

For additional options and details:

```bash
ng generate --help
```

## Building

### Production Build

Create an optimized production build with all optimizations enabled:

```bash
pnpm build
```

or

```bash
npx ng build
```

Build artifacts will be stored in the `dist/calculator` directory. The build includes:

- Minified and uglified code
- Tree-shaking for unused code elimination
- Angular AOT (Ahead-of-Time) compilation
- Output hashing for cache busting

### Development Build

Generate a development build with source maps and unminified code:

```bash
npx ng build --configuration development
```

### Watch Mode

Rebuild automatically when source files change:

```bash
pnpm watch
```

Build artifacts will be regenerated in `dist/calculator` without rebuilding the entire project.

### Build Configuration

Build configurations are defined in `angular.json`:

- **Production**: Full optimization, minimal bundle size, output hashing
- **Development**: Source maps, no optimization, vendor chunk separation

Build budgets are enforced:

- Initial bundle: Maximum 1MB warning, 500KB error
- Component styles: Maximum 20KB error, 10KB warning

## Testing

### Unit Tests

Execute unit tests using Karma test runner and Jasmine testing framework:

```bash
pnpm test
```

or

```bash
npx ng test
```

Tests run in watch mode by default. Modify test files and see results update automatically.

### Test Configuration

- Test runner: Karma
- Testing framework: Jasmine
- Coverage tool: Istanbul (via Karma Coverage)
- Browser: Chrome (default)

### Coverage Reports

Generate code coverage reports:

```bash
npx ng test --code-coverage
```

Coverage reports will be generated in the `coverage/` directory. View detailed coverage metrics by opening `coverage/index.html` in your browser.

### End-to-End Tests

To run end-to-end tests, add an e2e testing package:

```bash
npx ng e2e
```

Note: E2E testing package must be added separately as it is not included in the default Angular CLI setup.

## Configuration

### TypeScript Configuration

The project uses strict TypeScript settings for enhanced type safety:

- Strict mode enabled
- No implicit overrides allowed
- No property access from index signature
- Implicit returns required
- No fallthrough switch cases

Configuration file: `tsconfig.json`

### Environment Configuration

Environment-specific variables can be configured in:

- Development: `src/environments/environment.ts`
- Production: `src/environments/environment.prod.ts`

Environment files are swapped during the build process:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false
};

// src/environments/environment.prod.ts
export const environment = {
  production: true
};
```

### Routing Configuration

Routes are defined in `src/app/app-routing.module.ts` with lazy-loaded modules:

```typescript
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'derivate', loadChildren: () => import('./derivation/derivation.module')... },
      { path: 'integrate', loadChildren: () => import('./integration/integration.module')... },
      { path: 'course', loadChildren: () => import('./course/course.module')... },
      { path: 'equation', loadChildren: () => import('./equation/equation.module')... },
      { path: 'graph', loadChildren: () => import('./graphing/graphing.module')... },
      { path: 'matrix', loadChildren: () => import('./matrix/matrix.module')... },
      { path: 'stats', loadChildren: () => import('./stats/stats.module')... },
      { path: 'ode', loadChildren: () => import('./ode/ode.module')... },
      { path: '', loadChildren: () => import('./calculator/calculator.module')... }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
```

## API Integration

This frontend application communicates with the Calculato REST API backend. Ensure the API server is running and accessible before starting the development server.

### HTTP Client Setup

The application includes `HttpClientModule` for backend communication:

```typescript
// src/app/app.module.ts
imports: [
  HttpClientModule
]
```

Use Angular's `HttpClient` service to make requests to the backend API:

```typescript
import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient) {}
```

## Scripts Reference

All available scripts defined in `package.json` (execute using `pnpm <script>`):

| Script | Command | Purpose |
|--------|---------|---------|
| `start` | `ng serve` | Run development server |
| `build` | `ng build` | Create production build |
| `watch` | `ng build --watch --configuration development` | Watch and rebuild on changes |
| `test` | `ng test` | Execute unit tests |
| `ng` | `ng` | Access Angular CLI directly |

## Performance Optimization

The application implements several performance optimization strategies:

### Lazy Loading

Feature modules are lazy-loaded to reduce initial bundle size:

```typescript
{
  path: 'derivate',
  loadChildren: () => import('./derivation/derivation.module').then(m => m.DerivationModule)
}
```

### Change Detection

Angular's default change detection strategy is used. Optimize with `OnPush` strategy when appropriate.

### Bundle Size Management

Build budgets are configured to enforce bundle size limits:

- Initial bundle: 1MB maximum
- Component styles: 20KB maximum

Monitor bundle size:

```bash
ng build --stats-json
webpack-bundle-analyzer dist/calculator/stats.json
```

## Code Quality

### ESLint Integration

The project includes Angular ESLint for code quality:

```bash
ng lint
```

### TypeScript Strict Mode

Strict TypeScript checking is enabled to catch errors during development.

### Code Formatting

Use a code formatter like Prettier:

```bash
npm install --save-dev prettier
```

## Styling

### SCSS Preprocessing

Styles are written in SCSS (Sass):

- Global styles: `src/styles.scss`
- Component styles: `*.component.scss` (scoped)

SCSS is automatically compiled during build.

### Style Conventions

- Use SCSS variables for colors and dimensions
- Scope component styles to prevent conflicts
- Follow BEM (Block Element Modifier) naming when appropriate

## Dependencies and Maintenance

### Checking Outdated Dependencies

```bash
npm outdated
```

### Updating Dependencies

```bash
npm update
```

### Auditing Security Vulnerabilities

```bash
npm audit
npm audit fix
```

## Troubleshooting

### Common Issues

**Issue**: Port 4200 already in use

```bash
ng serve --port 4300
```

**Issue**: Module not found errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

**Issue**: TypeScript compilation errors

```bash
# Check TypeScript version
tsc --version

# Update TypeScript if needed
npm install --save-dev typescript@4.7.2
```

**Issue**: Build size exceeds budget

Review and optimize:
- Lazy load unnecessary features
- Remove unused dependencies
- Implement tree-shaking

## Contributing

When contributing to this project:

1. Follow the established module structure
2. Maintain TypeScript strict mode compliance
3. Write unit tests for new features
4. Run `ng lint` before committing
5. Use semantic commit messages

## Browser Support

The application targets modern browsers with ES2020 support:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Polyfills are included in `src/polyfills.ts` for broader compatibility if needed.

## Additional Resources

### Official Documentation

- [Angular Documentation](https://angular.io)
- [Angular CLI Reference](https://angular.io/cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [RxJS Documentation](https://rxjs.dev)
- [mathjs Documentation](https://mathjs.org)
- [MathJax Documentation](https://docs.mathjax.org)

### Related Repositories

- [Calculato REST API](https://github.com/Sande-Ricardo/calculato-rest_api) - Main backend API

## License

Check the repository for license information.

## Support

For issues, feature requests, or documentation improvements, please refer to the main repository:

[Calculato REST API Repository Issues](https://github.com/Sande-Ricardo/calculato-rest_api/issues)

---

Last Updated: July 2026
