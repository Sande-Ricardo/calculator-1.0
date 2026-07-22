import { Injectable } from '@angular/core';

declare var Desmos: any;

@Injectable({
  providedIn: 'root'
})
export class DesmosLoaderService {
  private scriptLoadedPromise: Promise<void> | null = null;

  loadDesmos(): Promise<void> {
    if (this.scriptLoadedPromise) {
      return this.scriptLoadedPromise;
    }

    if (typeof (window as any).Desmos !== 'undefined') {
      this.scriptLoadedPromise = Promise.resolve();
      return this.scriptLoadedPromise;
    }

    this.scriptLoadedPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      // Using official Desmos API v1.8 CDN
      script.src = 'https://www.desmos.com/api/v1.8/calculator.js?apiKey=dcb31709b452b1494215461100d9324b';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (err) => {
        this.scriptLoadedPromise = null;
        reject(err);
      };
      document.head.appendChild(script);
    });

    return this.scriptLoadedPromise;
  }
}
