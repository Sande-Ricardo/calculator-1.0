import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-financial-math-main',
  templateUrl: './financial-math-main.component.html',
  styleUrls: ['./financial-math-main.component.scss']
})
export class FinancialMathMainComponent implements OnInit {

  activeTab: 'interest' | 'amortization' | 'project' = 'interest';

  constructor() { }

  ngOnInit(): void {
  }

  setTab(tab: 'interest' | 'amortization' | 'project') {
    this.activeTab = tab;
  }
}
