import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../core/services/layout.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  currentLang = 'en';

  constructor(private layoutService: LayoutService, public languageService: LanguageService) { }

  ngOnInit(): void {
    this.currentLang = this.languageService.getCurrentLanguage();
  }

  toggleMobileMenu(): void {
    this.layoutService.toggleMobileMenu();
  }

  toggleLanguage(): void {
    this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
    this.languageService.setLanguage(this.currentLang);
  }

}
