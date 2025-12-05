import { Component, OnInit } from '@angular/core';
// import { BasicComponent } from '../basic/basic.component';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  constructor() {
    console.log("CalculatorComponent");
    
  }

  ngOnInit(): void {
  }

}
