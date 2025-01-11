import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SharedService } from '../../../services/shared.service';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-user-settings-dialog',
  imports: [MatDialogModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatButtonModule, TranslatePipe],
  templateUrl: './user-settings-dialog.component.html',
  styleUrl: './user-settings-dialog.component.css'
})
export class UserSettingsDialogComponent {
  sharedService = inject(SharedService);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<UserSettingsDialogComponent>);
  
  displayNameList = signal<string[]>([
    ...(this.sharedService.gitHubUser()?.displayName ? [this.sharedService.gitHubUser()!.displayName] : []),
    ...(this.sharedService.bitbucketUser()?.displayName ? [this.sharedService.bitbucketUser()!.displayName] : [])
  ]);
  nameList = signal<string[]>([
    ...(this.sharedService.gitHubUser()?.name ? [this.sharedService.gitHubUser()!.name] : []),
    ...(this.sharedService.bitbucketUser()?.name ? [this.sharedService.bitbucketUser()!.name] : [])
  ]);
  avatarList = signal<{avatarUrl: string, provider: string}[]>([
    ...(this.sharedService.gitHubUser()?.avatarUrl ? [{
      avatarUrl: this.sharedService.gitHubUser()!.avatarUrl,
      provider: this.sharedService.gitHubUser()!.provider
    }] : []),
    ...(this.sharedService.bitbucketUser()?.avatarUrl ? [{
      avatarUrl: this.sharedService.bitbucketUser()!.avatarUrl,
      provider: this.sharedService.bitbucketUser()!.provider
    }] : [])
  ]);
  concatList = computed(() => [...this.nameList(), ...this.displayNameList()]);

  onDisplayNameChange(event: any) {
    this.data.displayName = event.value;
  }

  onAvatarChange(event: any) {
    this.data.avatarUrl = event.value;
  }

  onCancel() {
    this.dialogRef.close();
  }
}
