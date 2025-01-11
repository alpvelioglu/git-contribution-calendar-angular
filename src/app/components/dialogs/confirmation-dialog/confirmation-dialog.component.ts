import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ConfirmationDialog } from '../../../models/ConfirmationDialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
  imports: [
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatDialogClose,
      MatButtonModule,
      TranslatePipe,
    ],
})
export class ConfirmationDialogComponent {
    readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
    readonly data = inject<ConfirmationDialog>(MAT_DIALOG_DATA);

    onCancel(): void {
      this.data.answer = false;
      this.dialogRef.close(this.data);
    }

    onConfirm(): void {
      this.data.answer = true;
      this.dialogRef.close(this.data);
    }
}
