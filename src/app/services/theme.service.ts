import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themeSignal = signal<string>(localStorage.getItem('theme') ?? 'light');

  constructor()
  {
    effect(() => {
      localStorage.setItem('theme', this.themeSignal());
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(this.themeSignal());
    })
  }

  updateTheme()
  {
    this.themeSignal.update((value) => (value === 'dark' ? 'light' : 'dark'));
  }
}
