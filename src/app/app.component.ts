import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Calculator';
  
  constructor(public router: Router, private languageService: LanguageService) {
    this.languageService.initLanguage();
  }
}
