import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  id: string;
}

@Component({
  selector: 'ccn-profile-delete-dialog',
  templateUrl: 'profile-delete-dialog.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<ProfileDeleteDialogComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
