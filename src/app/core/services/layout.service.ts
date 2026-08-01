import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private mobileMenuOpenSubject = new BehaviorSubject<boolean>(false);
  public isMobileMenuOpen$: Observable<boolean> = this.mobileMenuOpenSubject.asObservable();

  constructor() {}

  toggleMobileMenu(): void {
    this.mobileMenuOpenSubject.next(!this.mobileMenuOpenSubject.value);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpenSubject.next(false);
  }

  openMobileMenu(): void {
    this.mobileMenuOpenSubject.next(true);
  }

  get isMobileMenuOpen(): boolean {
    return this.mobileMenuOpenSubject.value;
  }
}
