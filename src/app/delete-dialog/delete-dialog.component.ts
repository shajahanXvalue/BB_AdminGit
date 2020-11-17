import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

export interface ConfirmData {
  title: string
  message: string
}
@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>, private router: Router, private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmData) { }

  title: any;
  message: any;
  ngOnInit(): void {
    this.title = this.data.title
    this.message = this.data.message
  }

}
