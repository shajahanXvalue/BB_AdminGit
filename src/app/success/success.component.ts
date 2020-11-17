import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
export interface DialogData {
  value: string
  type: boolean
}

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  message: string
  typeFlag: boolean
  success: boolean
  constructor(
    public dialogRef: MatDialogRef<SuccessComponent>, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.message = this.data.value
    this.typeFlag = this.data.type
    if (this.typeFlag) {
      this.success = true
    } else {
      this.success = false
    }
  }
  close() {
    this.dialogRef.close(
      // this.router.navigateByUrl('/admin')
    );
  }

}
