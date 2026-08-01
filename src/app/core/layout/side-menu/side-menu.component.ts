import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  isMobileMenuOpen$: Observable<boolean>;

  constructor(private layoutService: LayoutService) {
    this.isMobileMenuOpen$ = this.layoutService.isMobileMenuOpen$;
  }

  ngOnInit(): void {
  }

  onNavItemClick(): void {
    this.layoutService.closeMobileMenu();
  }
}
