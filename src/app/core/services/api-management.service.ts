import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DerivativeRequestDTO, DerivativeResponseDTO } from 'src/app/interfaces/Derivation';
import { IntegrationRequestDTO, IntegrationResponseDTO } from 'src/app/interfaces/Integration';
import { EquationRequestDTO, EquationResponseDTO } from 'src/app/interfaces/Equation';
import { MatrixRequestDTO, MatrixResponseDTO } from 'src/app/interfaces/Matrix';
import {
  StatsDescriptiveRequestDTO,
  StatsDescriptiveResponseDTO,
  StatsProbabilityRequestDTO,
  StatsProbabilityResponseDTO
} from 'src/app/interfaces/Stats';
import { OdeSolveRequestDTO, OdeSolveResponseDTO } from 'src/app/interfaces/Ode';


import * as math from 'mathjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiManagementService {
  // remote api
  apiUrl: string = environment.apiGetaway + '/op';

  constructor(private http: HttpClient) {}

  sanitizeExpression(input: string): string {

    // Rational numbers missing
    // Example: 8 + 5*12+2^3-sqrt(4)*cos(4) -e^(2) + π - e
    let result = input;

    // Power replace ^ → **
    result = result.replace(/(\w|\)|\])\^(\w|\()/g, '$1**$2');

    // Sqrt replace √x → sqrt(x)
    result = result.replace(/√\s*(\w+|\([^()]+\))/g, 'sqrt($1)');

    // Replace π by pi
    result = result.replace(/π/g, 'pi');

    // Replace e (Euler's number) only when it is a mathematical constant
    // Avoid replacing variables named 'e'
    result = result.replace(/\be\b(?![a-zA-Z0-9_])/g, 'E');

    // Tricogonometric and logaritmic functions: allow uppercase and lowercase
    result = result.replace(/\bcos\b/gi, 'cos');
    result = result.replace(/\bsin\b/gi, 'sin');
    result = result.replace(/\btan\b/gi, 'tan');
    result = result.replace(/\blog\b/gi, 'log');
    result = result.replace(/\bexp\b/gi, 'exp');
    result = result.replace(/\babs\b/gi, 'Abs');

    // Delete all whitespace
    result = result.replace(/\s+/g, '');

    return result;
  }

  // // REVISAR
  // derivationRequest(expression: string, variable:string): DerivativeResponseDTO {
  //   const request: DerivativeRequestDTO = {
  //     expression: expression,
  //     variable: variable
  //   };

  //   let response: DerivativeResponseDTO = {
  //     step_result: '0',
  //     derive: '',
  //     rule: '',
  //     substeps: []
  //   };

  //   this.http
  //     .post<DerivativeResponseDTO>(this.apiUrl + '/derivation', request)
  //     .subscribe((res) => {
  //       response = res;
  //     });

  //   return response;
  // }

  // integrationRequest(expression: string): DerivationResponse {
  //   const request: IntegrationRequestDTO = {
  //     expression: expression,
  //     variable: 'x',
  //   };

  //   let response: DerivationResponse = {
  //     result: '0',
  //   };

  //   this.http
  //     .post<DerivationResponse>(this.apiUrl + '/integration', request)
  //     .subscribe((res) => {
  //       response = res;
  //     });

  //   return response;
  // }

  derive(body:DerivativeRequestDTO): Observable<DerivativeResponseDTO> {
    return this.http.post<DerivativeResponseDTO>(this.apiUrl + '/derivation', body);
  }
  integrate(body: IntegrationRequestDTO): Observable<IntegrationResponseDTO> {
    return this.http.post<IntegrationResponseDTO>(this.apiUrl + '/integration', body);
  }
  solveEquation(body: EquationRequestDTO): Observable<EquationResponseDTO> {
    return this.http.post<EquationResponseDTO>(this.apiUrl + '/equation', body);
  }
  solveMatrix(body: MatrixRequestDTO): Observable<MatrixResponseDTO> {
    return this.http.post<MatrixResponseDTO>(this.apiUrl + '/matrix', body);
  }
  getDescriptiveStats(body: StatsDescriptiveRequestDTO): Observable<StatsDescriptiveResponseDTO> {
    return this.http.post<StatsDescriptiveResponseDTO>(environment.apiGetaway + '/stats/descriptive', body);
  }
  getProbabilityDistribution(body: StatsProbabilityRequestDTO): Observable<StatsProbabilityResponseDTO> {
    return this.http.post<StatsProbabilityResponseDTO>(environment.apiGetaway + '/stats/probability', body);
  }
  solveOde(body: OdeSolveRequestDTO): Observable<OdeSolveResponseDTO> {
    return this.http.post<OdeSolveResponseDTO>(environment.apiGetaway + '/ode/solve', body);
  }


  convertToLatex(expression: string) {
    try {
      const node = math.parse(expression);
      return node.toTex({ parenthesis: 'keep', implicit: 'show' });
    } catch (error) {
      console.error('Error converting to LaTeX:', error);
      return null
    }
  }
}
