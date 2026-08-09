import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANG_KEY = 'user_lang';

  constructor(private translate: TranslateService) {}

  initLanguage(): void {
    this.translate.addLangs(['en', 'es']);
    
    // Check local storage
    const savedLang = localStorage.getItem(this.LANG_KEY);
    
    if (savedLang) {
      this.translate.setDefaultLang(savedLang);
      this.translate.use(savedLang);
    } else {
      // Auto detect
      const browserLang = this.translate.getBrowserLang();
      const defaultLang = browserLang && browserLang.match(/es/) ? 'es' : 'en';
      this.translate.setDefaultLang(defaultLang);
      this.translate.use(defaultLang);
    }
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem(this.LANG_KEY, lang);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || this.translate.getDefaultLang();
  }
}
