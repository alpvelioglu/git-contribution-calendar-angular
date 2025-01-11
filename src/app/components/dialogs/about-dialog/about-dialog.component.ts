import { Component, VERSION } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { simpleLinkedin, simpleGmail } from '@ng-icons/simple-icons'
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';

@Component({
  selector: 'app-about-dialog',
  imports: [MatDialogModule, NgIcon, TranslatePipe, SafeHtmlPipe],
  templateUrl: './about-dialog.component.html',
  styleUrl: './about-dialog.component.css',
  providers: [provideIcons({ simpleLinkedin, simpleGmail})],
})
export class AboutDialogComponent {
  angularVersion = VERSION.full;
}
