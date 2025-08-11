import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DerivationRequest } from 'src/app/interfaces/DerivationRequest';
import { DerivationResponse } from 'src/app/interfaces/DerivationResponse';
// import { DerivationResponse } from 'src/app/interfaces/DerivationResponse';

@Injectable({
  providedIn: 'root',
})
export class ApiManagementService {
  // local
  apiUrl: string = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  sanitizeExpression(input: string): string {
    // 8 + 5*12+2^3-sqrt(4)*cos(4) -e^(2) + π - e
    let result = input;

    // Reemplazar potencias ^ → **
    result = result.replace(/(\w|\)|\])\^(\w|\()/g, '$1**$2');

    // Reemplazar raíz cuadrada √x → sqrt(x)
    result = result.replace(/√\s*(\w+|\([^()]+\))/g, 'sqrt($1)');

    // Reemplazar π por pi
    result = result.replace(/π/g, 'pi');

    // Reemplazar e (número de Euler) solo cuando es constante matemática
    // Evitar reemplazar variables con nombre 'e'
    result = result.replace(/\be\b(?![a-zA-Z0-9_])/g, 'E');

    // Funciones trigonométricas y logaritmos: permitir mayúsculas o minúsculas
    result = result.replace(/\bcos\b/gi, 'cos');
    result = result.replace(/\bsin\b/gi, 'sin');
    result = result.replace(/\btan\b/gi, 'tan');
    result = result.replace(/\blog\b/gi, 'log');
    result = result.replace(/\bexp\b/gi, 'exp');
    result = result.replace(/\babs\b/gi, 'Abs');

    // Eliminar espacios innecesarios
    result = result.replace(/\s+/g, '');

    return result;
  }

  derivationRequest(expression: string): DerivationResponse {
    const request: DerivationRequest = {
      expression: expression,
    };

    let response: DerivationResponse = {
      result: '0',
    };

    this.http
      .post<DerivationResponse>(this.apiUrl + '/derivation', request)
      .subscribe((res) => {
        response = res;
        console.log(res);
      });

    return response;
  }

  integrationRequest(expression: string): DerivationResponse {
    const request: DerivationRequest = {
      expression: expression,
    };

    let response: DerivationResponse = {
      result: '0',
    };

    this.http
      .post<DerivationResponse>(this.apiUrl + '/integration', request)
      .subscribe((res) => {
        response = res;
        console.log(res);
      });

    return response;
  }
}
