import { Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerDownload, tablerCopy } from '@ng-icons/tabler-icons';
import { simpleX, simpleLinkedin } from '@ng-icons/simple-icons'
import { SharedService } from '../../../services/shared.service';
import { formatDate } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-share-bottom-sheet',
  templateUrl: './share-bottom-sheet.component.html',
  styleUrls: ['./share-bottom-sheet.component.scss'],
  imports: [MatIconModule, NgIcon, TranslatePipe],
  providers: [provideIcons({ simpleX, simpleLinkedin, tablerDownload, tablerCopy })],
})
export class ShareBottomSheetComponent {
  
  readonly bottomSheetRef = inject(MatBottomSheetRef<ShareBottomSheetComponent>);
  readonly data = inject(MAT_BOTTOM_SHEET_DATA);
  dataPng = this.data.imageData.toDataURL('image/png');
  sharedService = inject(SharedService);
  translatedService = inject(TranslateService);

  shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    //this.bottomSheetRef.dismiss();
  }

  shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    var shareOnTwitter = this.translatedService.instant('ShareOnTwitter');
    const text = encodeURIComponent(shareOnTwitter);
    this.data.imageData.toBlob((blob: Blob) => {
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    });
    //this.bottomSheetRef.dismiss();
  }

  downloadCalendar() {
    const a = document.createElement('a');
    a.href = this.dataPng;
    a.download = `${this.sharedService.preferedDisplay()?.displayName}'s 2024-git-contributions${formatDate(Date.now(), 'ddMMyyyy', 'en-US')}.png`;
    a.click();
    this.bottomSheetRef.dismiss();
  }

  copyCalendar()
  {
    this.data.imageData.toBlob((blob: Blob) => {
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
    });
    this.bottomSheetRef.dismiss();
  }
}
