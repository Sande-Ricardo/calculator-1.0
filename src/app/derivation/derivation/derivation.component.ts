import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-derivation',
  templateUrl: './derivation.component.html',
  styleUrls: ['./derivation.component.scss']
})
export class DerivationComponent implements OnInit {

  functionInput: string = '';
  result: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  appendToInput(value: string): void {
    this.functionInput += value;
  }

  clearInput(): void {
    this.functionInput = '';
    this.result = '';
  }

  // Placeholder for derivation calculation logic
  calculateDerivative(): void {
    // Implement derivation logic here and update this.result
    this.result = 'Derivative result will be shown here';
  }
}
