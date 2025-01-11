import { Component, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-git-stats',
  imports: [MatCardModule],
  templateUrl: './git-stats.component.html',
  styleUrl: './git-stats.component.css',
})
export class GitStatsComponent {
  title = input.required<string>();
  description = input.required<string>();
  details = input.required<string>();
}
