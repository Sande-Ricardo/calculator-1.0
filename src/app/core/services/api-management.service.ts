import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DerivationRequest } from 'src/app/interfaces/DerivationRequest';
import { DerivationResponse } from 'src/app/interfaces/DerivationResponse';
// import { DerivationResponse } from 'src/app/interfaces/DerivationResponse';

@Injectable({
  providedIn: 'root'
})
export class ApiManagementService {

  // local
  apiUrl: string = 'http://localhost:8080/api';

  constructor(private http:HttpClient) {

  }



  derivationRequest(expression:string):DerivationResponse{

    const request:DerivationRequest = {
      expression: expression
    };

    let response:DerivationResponse = {
      result: "0"
    }

    this.http.post<DerivationResponse>(this.apiUrl+'/derivation', request)
      .subscribe((res) => {
        response = res;
        console.log(res);
      });

    return response;
  }

  integrationRequest(expression:string):DerivationResponse{

    const request:DerivationRequest = {
      expression: expression
    };

    let response:DerivationResponse = {
      result: "0"
    }

    this.http.post<DerivationResponse>(this.apiUrl+'/integration', request)
      .subscribe((res) => {
        response = res;
        console.log(res);
      });

    return response;
  }
}
