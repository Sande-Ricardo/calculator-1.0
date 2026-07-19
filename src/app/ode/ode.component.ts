import { Component, OnInit } from '@angular/core';
import { ApiManagementService } from 'src/app/core/services/api-management.service';
import { OdeSolveRequestDTO, OdeSolveResponseDTO, InitialConditionsDTO } from 'src/app/interfaces/Ode';

@Component({
  selector: 'app-ode',
  templateUrl: './ode.component.html',
  styleUrls: ['./ode.component.scss']
})
export class OdeComponent implements OnInit {

  // View Switcher
  currentView: string = 'analytical';

  // Inputs
  equation: string = "y' + 2*y = exp(x)";
  independentVar: string = 'x';
  dependentVar: string = 'y';
  
  // IVP Options
  isIVP: boolean = true;
  x0: number = 0;
  y0: number = 1;
  y0Prime: number | null = null;

  // State
  loading: boolean = false;
  error: string = '';
  result: OdeSolveResponseDTO | null = null;

  constructor(private apiService: ApiManagementService) { }

  ngOnInit(): void {
    // Initial load
    this.solve();
  }

  solve(): void {
    if (!this.equation.trim()) {
      this.error = 'Please enter a differential equation.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.result = null;

    const request: OdeSolveRequestDTO = {
      equation: this.equation.trim(),
      independent_var: this.independentVar.trim() || 'x',
      dependent_var: this.dependentVar.trim() || 'y'
    };

    if (this.isIVP) {
      const initialConditions: InitialConditionsDTO = {
        x0: this.x0,
        y0: this.y0
      };

      if (this.y0Prime !== null && this.y0Prime !== undefined && this.y0Prime.toString().trim() !== '') {
        initialConditions.y0_prime = Number(this.y0Prime);
      }

      request.initial_conditions = initialConditions;
    }

    this.apiService.solveOde(request).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.status === 'success') {
          this.result = res;
        } else {
          this.error = 'Calculation failed on the server side.';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('ODE Solver error:', err);
        this.error = 'Error calling the ODE solver API. Please verify the input format.';
      }
    });
  }

  clear(): void {
    this.equation = '';
    this.independentVar = 'x';
    this.dependentVar = 'y';
    this.isIVP = false;
    this.x0 = 0;
    this.y0 = 0;
    this.y0Prime = null;
    this.error = '';
    this.result = null;
  }
}
