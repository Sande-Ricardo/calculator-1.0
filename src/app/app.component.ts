import { Component } from '@angular/core';
import { ButtonComponent } from 'src/app/button/button.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Calculator';
  
  results = "Resultado";

  a:number = 0;
  b:number = 0;
  c:number = 0;
  sign:number=0

  

  suma(a:number, b:number){
    this.c = (a+b);
    return (this.c)
  }

  setAB(num:number,){
    if (this.a == 0) 
    {this.a = num} else
    {this.b = num}
  }

  setSign(num:number){
  /*  usar do while para setear el signo en "sign" a partir de distintos valores. Ej: 1 == suma / 1 == operaciónDeSuma(a,b) */
  }

}
