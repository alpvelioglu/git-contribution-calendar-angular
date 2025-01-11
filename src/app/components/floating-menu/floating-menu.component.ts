import { Component, computed, inject, SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AboutDialogComponent } from '../dialogs/about-dialog/about-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShareBottomSheetComponent } from '../dialogs/share-bottom-sheet/share-bottom-sheet.component';
import html2canvas from 'html2canvas';
import { SharedService } from '../../services/shared.service';
import { Providers } from '../../enums/providers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService, TranslatePipe, _ } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-floating-menu',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './floating-menu.component.html',
  styleUrl: './floating-menu.component.css',
})
export class FloatingMenuComponent {
  readonly dialog = inject(MatDialog);
  readonly bottomSheet = inject(MatBottomSheet);
  readonly snackBar = inject(MatSnackBar);

  sharedService = inject(SharedService);
  translateService = inject(TranslateService);
  sanitizer = inject(DomSanitizer);

  isGithubUser = computed(() => this.sharedService.gitHubUser() !== null);
  isBitbucketUser = computed(() => this.sharedService.bitbucketUser() !== null);
  username = computed(() => this.sharedService.preferedDisplay()?.displayName);
  avatarUrl = computed(() => this.sharedService.preferedDisplay()?.avatarUrl);

  isLoading = false;

  languages = [
    { code: 'gb', name: 'English'},
    { code: 'tr', name: 'Turkish'}
  ]
  languageIndex = 0;
  
  openAboutDialog() {
    this.dialog.open(AboutDialogComponent);
  }

  openShareSheet() {
    if(this.sharedService.bitbucketUser() || this.sharedService.gitHubUser()) 
    {
      this.isLoading = true;
      this.snapshotCalendar().then(imageData => {
        this.bottomSheet.open(ShareBottomSheetComponent, {
          data: { imageData }
        });
        this.isLoading = false;
      });
    } 
    else 
    {
      var shareZeroText = this.translateService.instant('ShareZeroLength');
      var close = this.translateService.instant('Close');
      this.snackBar.open(`${shareZeroText}`, close, { duration: 5000 });
    }
  }

  snapshotCalendar(): Promise<any> {
    const calendarElement = document.querySelector('#calendar-container') as HTMLElement;
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      background-color: #ffffff;
      padding: 16px 0;
      width: fit-content;
      box-sizing: border-box;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen;
      font-size: 24px;
      font-weight: 600;
      color: #24292f;
      display: flex;
      align-items: center;
      gap: 4px;
      padding-left: 8rem;
      margin-bottom: 12px;
    `;

    const headerText = document.createElement('span');
    headerText.style.cssText = `
      line-height: 32px;
    `;
    let providers = '';
    if (this.isGithubUser()) {
      providers = Providers.GitHub;
      if (this.isBitbucketUser()) {
        providers += ` & ${Providers.Bitbucket}`;
      }
    } else if (this.isBitbucketUser()) {
      providers = `${Providers.Bitbucket}`;
    }

    var gitShareText = this.translateService.instant('GitShareText', {username: this.username(), providers: providers});
    var sanitizedText = this.sanitizer.sanitize(SecurityContext.HTML, gitShareText);
    headerText.innerHTML = sanitizedText!;

    header.appendChild(headerText);
    
    const calendarClone = calendarElement.cloneNode(true) as HTMLElement;
    const firstChild = calendarClone.firstElementChild as HTMLElement;
    if (firstChild) {
      firstChild.style.cssText += `
        margin: 8px 0 8px 0 !important;
      `;
  }
    
    const filterElement = calendarClone.querySelector('[id="calendar-filter"]');
    const userInfoElement = calendarClone.querySelector('[id="user-info"]');
    filterElement?.parentElement?.removeChild(filterElement);
    userInfoElement?.parentElement?.removeChild(userInfoElement);
    
    calendarClone.insertBefore(header, calendarClone.firstChild);
    
    wrapper.appendChild(calendarClone);
    document.body.appendChild(wrapper);
    
    return html2canvas(wrapper, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    }).then(canvas => {
      document.body.removeChild(wrapper);
      return canvas;
    });
  }

  switchLanguage() {
    this.languageIndex = (this.languageIndex + 1) % this.languages.length;
    const newLang = this.languages[this.languageIndex].code;
    this.translateService.use(newLang);
    this.sharedService.renderUI.set(!this.sharedService.renderUI());
  }
}
