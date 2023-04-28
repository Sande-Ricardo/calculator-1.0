import { Component } from '@angular/core';
import { ButtonComponent } from 'src/app/button/button.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Calculator';
  

  a:number = 0;
  b:number = 0;
  collect:string="";
  c:number = 0;
  d:string = "";
  sign:number=0;

  
  

  sum(){
    this.c = (this.a+this.b);
    this.d="+";
  };
  
  rest(){
    this.c= (this.a-this.b);
    this.d="-";
  };

  prod(){
    this.c=(this.a*this.b);
    this.d="*";
  };

  coc(){
    this.c=(this.a/this.b);
    this.d="/";
  };

  ac(){
    this.a=0;
    this.b=0;
    this.sign=0;
    this.collect="";
  };

  setAB(num:number){
    this.collect += (num.toString());
  };

  setP(){
    if (Number(this.collect)!= 0)
      {this.collect += (".")}
    else {alert("Error")};
    /* arreglar: el alert error debería salir si se pone un punto luego de otro punto*/
  };

  setSign(num:number){
    this.sign=num;
    this.a=Number(this.collect);
    this.collect="";
    /* console.log(this.a) */
  };

  setOp(){
  /*  usar do while/ switch para setear el signo en "sign" a partir de distintos valores. Ej: 1 == suma / 1 == operaciónDeSuma(a,b) */
    switch (this.sign){
      case 1:
        this.sum();
        break;
      case 2:
        this.rest();
        break;
      case 3:
        this.prod();
        break;
      case 4:
        this.coc();
        break;
      
    }

  };

  igualdad(){
    this.b=Number(this.collect)
    this.setOp();
    console.log(this.c)
    this.ac()
  }

 
  /*creo que no hace falta setear algún numero, solo debería asociar un número para cada operación. 
  Ej: fijo un 1 en la suma y el event hace que se setee el 1 en sign, el igual corre la función respecto al valor de sign*/

}
