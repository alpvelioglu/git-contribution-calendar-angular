import { Component, inject } from '@angular/core';
import { GitCalendarComponent } from "./components/git-calendar/git-calendar.component";
import { ThemeService } from './services/theme.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [GitCalendarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'git-contribution-calendar';
  themeService = inject(ThemeService);

  constructor(private translateService: TranslateService) {
    // First loading of the app it became undefined even if it is set in the app.config.ts,
    // so when I set it here it works. :D
    this.translateService.currentLang = 'gb';
  }
}
