import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  model,
  Renderer2,
  signal,
} from '@angular/core';
import * as d3 from 'd3';
import { ConfigService } from '../../services/config.service';
import { GithubService } from '../../services/github.service';
import { Contribution } from '../../models/Contribution';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ThemeService } from '../../services/theme.service';
import { BitbucketService } from '../../services/bitbucket.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionLogoGithub, ionLogoBitbucket, ionLogoGitlab } from '@ng-icons/ionicons';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Providers } from '../../enums/providers';
import { GitStatsComponent } from '../git-stats/git-stats.component';
import { MatDialog } from '@angular/material/dialog';
import { ProviderAuthDialogComponent } from '../dialogs/provider-auth-dialog/provider-auth-dialog.component';
import { ProviderAuthDialog } from '../../models/ProviderAuthDialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { FloatingMenuComponent } from '../floating-menu/floating-menu.component';
import { SharedService } from '../../services/shared.service';
import { UserSettingsDialogComponent } from '../dialogs/user-settings-dialog/user-settings-dialog.component';
import { _, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-git-calendar',
  templateUrl: './git-calendar.component.html',
  styleUrls: ['./git-calendar.component.scss'],
  providers: [
    ClipboardModule,
    provideIcons({ ionLogoGithub, ionLogoBitbucket, ionLogoGitlab }),
  ],
  imports: [
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    NgIcon,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    GitStatsComponent,
    FloatingMenuComponent,
    TranslatePipe,
    ClipboardModule,
    AsyncPipe,
    MatTooltipModule,
  ],
})
export class GitCalendarComponent {
  readonly authData = signal<ProviderAuthDialog>({
    provider: '',
    username: '',
    apiKey: '',
    avatarUrl: '',
    displayName: '',
  });
  readonly dialog = inject(MatDialog);

  months: string[] = [];
  isGithub: boolean = false;
  isBitbucket: boolean = false;
  isGitLab: boolean = false;

  isGithubVisible: boolean = true;
  isBitbucketVisible: boolean = true;

  githubApiKey = model<string>('');
  bitbucketApiKey = model<string>('');

  calendarDays = computed(() => this.mergeSameDateContributions());
  totalContributions = computed(() =>
    this.calendarDays().reduce((acc, curr) => acc + curr.contributionCount, 0)
  );
  maxActivities = computed(async () => {
    var renderUI = this.sharedService.renderUI();
    const max = Math.max(
      ...this.calendarDays().map(
        (contribution) => contribution.contributionCount
      ),
      0
    );
    const maxDayContribution = this.calendarDays()
      .find((contribution) => contribution.contributionCount === max);

    let dayOfMaxActivity = '';
    if (maxDayContribution) {
      const date = maxDayContribution.date;
      const day = await this.translateWithKey(`Day.${date.toString().split(' ')[0]}`);
      const month = await this.translateWithKey(`Month.${date.toString().split(' ')[1]}`);
      const dayNum = date.getDate();
      const year = date.getFullYear();
      
      dayOfMaxActivity = `${day} ${month} ${dayNum} ${year}`;
    }

    return {
      dayOfMaxActivity,
      maxActivity: max,
    };
  });
  longestStreak = computed(async () => {
    this.sharedService.renderUI();
    const streak = this.calculateLongestStreak();
    
    if (streak.startDate && streak.endDate) {
      const startDate = new Date(streak.startDate);
      const endDate = new Date(streak.endDate);
      
      const startDay = await this.translateWithKey(`Day.${startDate.toString().split(' ')[0]}`);
      const startMonth = await this.translateWithKey(`Month.${startDate.toString().split(' ')[1]}`);
      const endDay = await this.translateWithKey(`Day.${endDate.toString().split(' ')[0]}`);
      const endMonth = await this.translateWithKey(`Month.${endDate.toString().split(' ')[1]}`);
      
      return {
        startDate: `${startDay} ${startMonth} ${startDate.getDate()} ${startDate.getFullYear()}`,
        endDate: `${endDay} ${endMonth} ${endDate.getDate()} ${endDate.getFullYear()}`,
        streak: streak.streak
      };
    }
    
    return streak;
  });

  tempStaticDate = computed(async () => {
    this.sharedService.renderUI();
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');

    const startDay = await this.translateWithKey(`Day.${startDate.toString().split(' ')[0]}`);
    const endDay = await this.translateWithKey(`Day.${endDate.toString().split(' ')[0]}`);
    const startMonth = await this.translateWithKey(`Month.${startDate.toString().split(' ')[1]}`);
    const endMonth = await this.translateWithKey(`Month.${endDate.toString().split(' ')[1]}`);

    return { startDate: `${startDay} ${startMonth} ${startDate.getDate()} ${startDate.getFullYear()}`, endDate: `${endDay} ${endMonth} ${endDate.getDate()} ${endDate.getFullYear()}` };
  });

  gitHubContributions = signal<Contribution[]>([]);
  bitbucketContributions = signal<Contribution[]>([]);

  Temp_gitHubContributions = signal<Contribution[]>([]);
  Temp_bitbucketContributions = signal<Contribution[]>([]);

  configService = inject(ConfigService);
  githubService = inject(GithubService);
  bitbucketService = inject(BitbucketService);
  themeService = inject(ThemeService);
  renderer = inject(Renderer2);
  _snackBar = inject(MatSnackBar);
  sharedService = inject(SharedService);
  elementRef = inject(ElementRef);
  translateService = inject(TranslateService);

  providers = Providers;

  selectedProviders: any[] = [];

  constructor() {
    effect(async () => {
      var renderUI = this.sharedService.renderUI();
      await this.createCalendar();
    });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(changes);
  //   if (changes['contributions'] && !changes['contributions'].firstChange) {
  //     this.calendarDays = this.contributions.map(contribution => ({
  //       date: new Date(contribution.date),
  //       contributionCount: contribution.contributionCount
  //     }));
  //     this.createCalendar();
  //   }
  // }

  async ngOnInit() {
    await this.createCalendar();
  }

  private async createCalendar() {
    const element = this.elementRef.nativeElement.querySelector(
      '.contribution-calendar'
    );
    d3.select(element).selectAll('svg').remove();

    const width = 830;
    const height = 130;
    const cellSize = 15;

    const colorScale = d3
      .scaleThreshold<number, string>()
      .domain([1, 2, 4, 5])
      .range(['#ebedf0', '#9BE9A8', '#40C463', '#30A14E', '#216E39']);

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    //const year = d3.timeFormat('%Y')(new Date());
    const year = '2024';

    const timeFormat = d3.timeFormat('%Y-%m-%d');
    const contributionsByDate = new Map(
      this.calendarDays().map((d) => [timeFormat(d.date), d.contributionCount])
    );

    var months = d3.utcMonths(
      new Date(`${year}-01-01`),
      new Date(`${+year + 1}-01-01`)
    );

    const daysOfWeek = await Promise.all([
      this.translateWithKey('Day.Sun'),
      this.translateWithKey('Day.Mon'),
      this.translateWithKey('Day.Tue'),
      this.translateWithKey('Day.Wed'),
      this.translateWithKey('Day.Thu'),
      this.translateWithKey('Day.Fri'),
      this.translateWithKey('Day.Sat')
    ]);

    const monthsLabels = await Promise.all([
      this.translateWithKey('Month.Jan'),
      this.translateWithKey('Month.Feb'),
      this.translateWithKey('Month.Mar'),
      this.translateWithKey('Month.Apr'),
      this.translateWithKey('Month.May'),
      this.translateWithKey('Month.Jun'),
      this.translateWithKey('Month.Jul'),
      this.translateWithKey('Month.Aug'),
      this.translateWithKey('Month.Sep'),
      this.translateWithKey('Month.Oct'),
      this.translateWithKey('Month.Nov'),
      this.translateWithKey('Month.Dec'),
    ]);

    const monthsLong = await Promise.all([
      this.translateWithKey('MonthLong.Jan'),
      this.translateWithKey('MonthLong.Feb'),
      this.translateWithKey('MonthLong.Mar'),
      this.translateWithKey('MonthLong.Apr'),
      this.translateWithKey('MonthLong.May'),
      this.translateWithKey('MonthLong.Jun'),
      this.translateWithKey('MonthLong.Jul'),
      this.translateWithKey('MonthLong.Aug'),
      this.translateWithKey('MonthLong.Sep'),
      this.translateWithKey('MonthLong.Oct'),
      this.translateWithKey('MonthLong.Nov'),
      this.translateWithKey('MonthLong.Dec'),
    ]);
    const offsetTop = 20;

    //Month Labels
    svg
      .append('g')
      .selectAll('text')
      .data(months)
      .join('text')
      .attr('transform', `translate(30, 0)`)
      .attr(
        'x',
        (d) => d3.utcWeek.count(d3.utcYear(d), d) * cellSize + cellSize
      )
      .attr('y', offsetTop / 2 + 4)
      .attr('text-anchor', 'middle')
      .text((d) => {
        var month = d.getMonth();
        return monthsLabels[month];
      });

    // Shift grid and day-of-week labels below
    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(30,${offsetTop})`);

    //Grid
    chartGroup
      .selectAll('rect')
      .data(
        d3.utcDays(new Date(`${year}-01-01`), new Date(`${+year + 1}-01-01`))
      )
      .join('rect')
      .attr('width', cellSize - 2)
      .attr('height', cellSize - 2)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('x', (d) => d3.utcWeek.count(d3.utcYear(d), d) * cellSize + 1)
      .attr('y', (d) => d.getUTCDay() * cellSize + 1)
      .attr('fill', (d) => {
        const dateStr = timeFormat(d);
        const count = contributionsByDate.get(dateStr) || 0;
        return colorScale(count);
      })
      .append('title')
      .text((d) => {
        const dateStr = timeFormat(d);
        const count = contributionsByDate.get(dateStr) || 0;
        const monthKey = d.toString().split(' ')[1];
        const day = d.getUTCDate();
        
        const ordinalSuffix = (n: number) => {
          const s = ['th', 'st', 'nd', 'rd'];
          const v = n % 100;
          return (s[(v - 20) % 10] || s[v] || s[0]);
        };

        const tooltipKey = count === 0 
          ? 'ContributionTooltip.NoContribution'
          : 'ContributionTooltip.WithContribution';

        const template = this.translateService.instant(_(tooltipKey));
        const month = this.translateService.instant(_(`MonthLong.${monthKey}`));

        return template
          .replace('{{day}}', day.toString())
          .replace('{{month}}', month)
          .replace('{{count}}', count.toString())
          .replace('{{ordinal}}', this.translateService.currentLang === 'gb' ? ordinalSuffix(day) : '')
          .replace('{{plural}}', this.translateService.currentLang === 'gb' && count > 1 ? 's' : '');
      });

    // Days of the week
    svg
      .append('g')
      // Shift it so it's within the visible area
      .attr('transform', `translate(20, 22)`)
      .selectAll('text')
      .data([1, 3, 5]) // Monday, Wednesday, Friday
      .join('text')
      .attr('x', 5)
      .attr('y', (d) => d * cellSize + cellSize / 1.5)
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .text((d) => daysOfWeek[d]);
  }

  mergeSameDateContributions(): Contribution[] {
    var githubContributions = this.gitHubContributions();
    var bitbucketContributions = this.bitbucketContributions();

    var mergeSameDateContributions = new Map();

    githubContributions.forEach((contribution) => {
      mergeSameDateContributions.set(
        contribution.date,
        contribution.contributionCount
      );
    });

    bitbucketContributions.forEach((contribution) => {
      var existingKey = Array.from(mergeSameDateContributions.keys()).find(
        (key) => key.getTime() === contribution.date.getTime()
      );

      if (existingKey)
        mergeSameDateContributions.set(
          existingKey,
          mergeSameDateContributions.get(existingKey) +
            contribution.contributionCount
        );
      else
        mergeSameDateContributions.set(
          contribution.date,
          contribution.contributionCount
        );
    });
    const updatedContributions = Array.from(
      mergeSameDateContributions,
      ([date, contributionCount]) => ({ date, contributionCount })
    );
    return updatedContributions;
  }

  onProviderSelection(source: any) {
    if (source._checked) 
    {
      this.authData.set({
        provider: source.value,
        username: '',
        apiKey: '',
        avatarUrl: '',
        displayName: '',
      });
      this.openAuthDialog(source);
    } 
    else if (!source._checked) 
    {
      this.openConfirmationDialog(source);
    }
  }

  onProviderFilterChange(event: any) {
    if (event.target.outerText === this.providers.GitHub) {
      this.isGithubVisible = !this.isGithubVisible;
      if (this.isGithubVisible) 
      {
        this.gitHubContributions.set(this.Temp_gitHubContributions());
      } 
      else 
      {
        this.Temp_gitHubContributions.set(this.gitHubContributions());
        this.gitHubContributions.set([]);
      }
    } 
    else if (event.target.outerText === this.providers.Bitbucket) 
    {
      this.isBitbucketVisible = !this.isBitbucketVisible;
      if (this.isBitbucketVisible)
        this.bitbucketContributions.set(this.Temp_bitbucketContributions());
      
      else 
      {
        this.Temp_bitbucketContributions.set(this.bitbucketContributions());
        this.bitbucketContributions.set([]);
      }
    }
  }

  calculateLongestStreak() {
    let currentCount = 0;
    let maxCount = 0;
    let maxStartDate = '';
    let maxEndDate = '';
    let tempStartDate = '';

    this.calendarDays()
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .forEach((contribution) => {
        if (contribution.contributionCount > 0) {
          currentCount++;
          if (currentCount === 1) 
          {
            tempStartDate = contribution.date.toDateString();
          }
          if (currentCount > maxCount) 
          {
            maxCount = currentCount;
            maxStartDate = tempStartDate;
            maxEndDate = contribution.date.toDateString();
          }
        } 
        else 
        {
          currentCount = 0;
        }
      });
    return {
      startDate: maxStartDate,
      endDate: maxEndDate,
      streak: maxCount,
    };
  }

  changeTheme() {
    this.themeService.updateTheme();
  }

  openAuthDialog(source: any): void {
    const dialogRef = this.dialog.open(ProviderAuthDialogComponent, {
      width: '500px',
      data: this.authData(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        var authenticationMessage = this.translateService.instant('AuthenticationSuccessful', {username: result.username});
        if (result.provider === this.providers.GitHub) 
        {
          this.githubService.getContributions(result.apiKey).subscribe({
            next: (data) => {
              this.gitHubContributions.set(data.map((contribution) => ({
                  //provider: Providers.Github,
                  date: new Date(contribution.date),
                  contributionCount: contribution.contributionCount,
                }))
              );

              this.sharedService.gitHubUser.set({
                name: result.username,
                avatarUrl: result.avatarUrl,
                displayName: result.displayName,
                provider: Providers.GitHub,
              });
              
              if (this.sharedService.preferedDisplay() === null)
                this.sharedService.preferedDisplay.set(this.sharedService.gitHubUser());

              this.isGithub = true;
              this.openSnackBar(authenticationMessage);
            },
            error: (error) => {
              var errText = this.translateService.instant('ContributionError', {errMessage: error.statusText});
              this.openSnackBar(errText);
              this.renderer.setProperty(source, 'checked', false);
              this.isGithub = false;
            }
          });
        }
        else if (result.provider === this.providers.Bitbucket) 
        {
          this.bitbucketService.getContributions(result.apiKey, result.username).subscribe({
            next: (data) => {
              this.bitbucketContributions.set(data.map((contribution: any) => ({
                  //provider: Providers.Bitbucket,
                  date: new Date(contribution.date),
                  contributionCount: contribution.contributionCount,
                }))
              );

              this.sharedService.bitbucketUser.set({
                name: result.username,
                avatarUrl: result.avatarUrl,
                displayName: result.displayName,
                provider: Providers.Bitbucket,
              });
              
              if (this.sharedService.preferedDisplay() === null)
                this.sharedService.preferedDisplay.set(this.sharedService.bitbucketUser());

              this.isBitbucket = true;
              this.openSnackBar(authenticationMessage);
            },
            error: (error) => {
              var errText = this.translateService.instant('ContributionError', {errMessage: error.statusText});
              this.openSnackBar(errText);
              this.renderer.setProperty(source, 'checked', false);
              this.isBitbucket = false;
            }
          });
        }
      } 
      else 
      {
        this.renderer.setProperty(source, 'checked', false);
      }
    });
  }

  openConfirmationDialog(source: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { provider: source.value, answer: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.answer) {
        var removedAuthentication = this.translateService.instant('AuthenticationRemoved', {provider: result.provider});
        this.openSnackBar(removedAuthentication);
        if (result.provider === this.providers.GitHub) 
        {
          this.isGithub = false;
          this.sharedService.gitHubUser.set(null);
          this.gitHubContributions.set([]);
        } 
        else if (result.provider === this.providers.Bitbucket) 
        {
          this.isBitbucket = false;
          this.sharedService.bitbucketUser.set(null);
          this.bitbucketContributions.set([]);
        }
      } 
      else 
      {
        this.renderer.setProperty(source, 'checked', true);
      }
    });
  }

  openSnackBar(message: string) {
    var okText = this.translateService.instant(_('Ok'));
    this._snackBar.open(message, okText, {
      duration: 2000,
    });
  }

  openUserSettingsDialog() {
    const dialogRef = this.dialog.open(UserSettingsDialogComponent, {
      width: '500px',
      data: {
        displayName: this.sharedService.preferedDisplay()?.displayName,
        avatarUrl: this.sharedService.preferedDisplay()?.avatarUrl,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.sharedService.preferedDisplay.set({
          displayName: result.displayName,
          avatarUrl: result.avatarUrl,
          name: result.name,
          provider: result.provider,
        });
      }
    });
  }

  translateWithKey(key: string, params?: any): Promise<string> {
    return new Promise((resolve) => {
      this.translateService.get(_(key), params).subscribe((res: string) => {
        resolve(res);
      });
    });
  }
}
