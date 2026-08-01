import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  isMobileMenuOpen$: Observable<boolean>;

  constructor(public router: Router, private layoutService: LayoutService) {
    this.isMobileMenuOpen$ = this.layoutService.isMobileMenuOpen$;
  }

  ngOnInit(): void {
  }

  closeMobileMenu(): void {
    this.layoutService.closeMobileMenu();
  }

}
