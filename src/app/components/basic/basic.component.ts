import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
  standalone: true
})
export class BasicComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  expression:string = "0";
  writing:boolean = true;

  setError(i:number){
    switch (i){
      case 0:
        this.expression = "!Error";
        break;
      case 1:
        this.expression = "Math error!";
        break;
    }
    this.writing = false;
  }

  setExp(char:string){
    if(this.writing){
      if(this.expression==="0"){
        this.expression = char;
      } else {
        this.expression += char;
      }
    }
  }

  solve(){
    
    try{
      // this.expression = eval(this.expression).toString();
      this.expression = eval(this.expression).toString();
    } catch {
      this.setError(0);
    }

    if(this.expression === "Infinity"){
      this.setError(1)
    }
  }

  C(){
    this.expression = "0";
    this.writing = true
  }

  del(){
    if(this.expression === "0" || this.expression.length === 1){
      this.expression = "0";
    } else if (this.expression == "!Error" || this.expression == "Math error!"){
      this.writing = true;
      this.expression = "0";
    } else{
      this.expression = this.expression.slice(0, -1)
    }
  }

  percent(){
    this.expression = (parseInt(this.expression)/100).toString() +"*"
  }

}
