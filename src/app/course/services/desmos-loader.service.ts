import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare var Desmos: any;

@Injectable({
  providedIn: 'root'
})
export class DesmosLoaderService {
  private scriptLoadedPromise: Promise<void> | null = null;

  loadDesmos(): Promise<void> {
    if (typeof (window as any).Desmos !== 'undefined') {
      return Promise.resolve();
    }

    if (this.scriptLoadedPromise) {
      return this.scriptLoadedPromise;
    }

    this.scriptLoadedPromise = new Promise((resolve, reject) => {
      const scriptId = 'desmos-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://www.desmos.com/api/v1.9/calculator.js?apiKey=${environment.desmosApiKey}`;
        script.async = true;
        document.head.appendChild(script);
      }

      const checkInterval = setInterval(() => {
        if (typeof (window as any).Desmos !== 'undefined') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 50);

      script.addEventListener('load', () => {
        clearInterval(checkInterval);
        resolve();
      });

      script.addEventListener('error', (err) => {
        clearInterval(checkInterval);
        this.scriptLoadedPromise = null;
        reject(err);
      });
    });

    return this.scriptLoadedPromise;
  }
}
