import { Component, computed, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProviderAuthDialog } from '../../../models/ProviderAuthDialog';
import { Providers } from '../../../enums/providers';
import { MatCardModule } from '@angular/material/card';
import { GithubService } from '../../../services/github.service';
import { BitbucketService } from '../../../services/bitbucket.service';
import { ConfigService } from '../../../services/config.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core'; 
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-provider-auth-dialog',
  templateUrl: './provider-auth-dialog.component.html',
  styleUrl: './provider-auth-dialog.component.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatCardModule,
    TranslatePipe,
    SafeHtmlPipe
  ],
})
export class ProviderAuthDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ProviderAuthDialogComponent>);
  readonly data = inject<ProviderAuthDialog>(MAT_DIALOG_DATA);
  providers = Providers;

  apiKey = model<string>('');
  baseUrl = model<string>('');

  username = model<string>('');
  bitbucketTokenPage = computed(() => `${this.baseUrl().endsWith('/') ? this.baseUrl().slice(0, -1) : this.baseUrl() }/plugins/servlet/access-tokens/users/${this.username()}/manage`);

  githubService = inject(GithubService);
  bitbucketService = inject(BitbucketService);
  configService = inject(ConfigService);
  translateService = inject(TranslateService);
  snackBar = inject(MatSnackBar);

  isValidUrl = signal(true);
  
  onCancel(): void {
    this.dialogRef.close();
  }

  clipboardPaste()
  {
    navigator.clipboard.readText().then((clipboardText) => {
      this.apiKey.set(clipboardText.slice(0,3) + '****************' + clipboardText.slice(-3));
      if(this.data.provider == Providers.GitHub)
      {
        this.githubService.getUser(clipboardText).subscribe({
          next: (data) => {
            this.data.username = data.name;
            this.data.provider = Providers.GitHub;
            this.data.apiKey = clipboardText;
            this.data.avatarUrl = data.avatarUrl;
            this.data.displayName = data.displayName;
          },
          error: (error) => {
            var errText = this.translateService.instant('UserError', {provider: this.providers.GitHub, errMessage: error});
            var closeText = this.translateService.instant('Close');
            this.snackBar.open(errText, closeText, { duration: 3000 });
          }
        });
      }
      else if(this.data.provider == Providers.Bitbucket)
      {
        this.bitbucketService.getUser(clipboardText, this.username()).subscribe({
          next: (data) => {
            this.data.username = data.name;
            this.data.provider = Providers.Bitbucket;
            this.data.apiKey = clipboardText;
            this.data.avatarUrl = data.avatarUrl;
            this.data.displayName = data.displayName;
            this.configService.set(Providers.Bitbucket, this.baseUrl().endsWith('/') ? this.baseUrl().slice(0, -1) : this.baseUrl());
          },
          error: (error) => {
            var errText = this.translateService.instant('UserError', {provider: this.providers.Bitbucket, errMessage: error.statusText});
            var closeText = this.translateService.instant('Close');
            this.snackBar.open(errText, closeText, { duration: 3000 });
          }
        });
      }
    }).catch(err => {
      console.error('Clipboard read failed:', err);
    });
  }

  public isEmpty(value: any): boolean {
    return value === undefined || value === null || value === "";
  }
}
