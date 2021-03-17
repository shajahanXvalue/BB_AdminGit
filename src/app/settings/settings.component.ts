import { Component, OnInit,Inject } from '@angular/core';
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PropertyServiceService } from "../property-service.service";
import { SuccessComponent } from "../success/success.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  userInfo = JSON.parse(localStorage.getItem("UserInfo"));

  constructor(
    // public dialogRef: MatDialogRef<SettingsComponent>,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public alertDialog: MatDialog,
    private http: HttpClient,
    private property: PropertyServiceService,) { }
    isAdOn:boolean = false;
    url = this.property.uri;
    UserInfo = JSON.parse(localStorage.getItem("UserInfo"));
  ngOnInit() {

    this.isAdOn = this.UserInfo.isAdsOn;
    console.log("isAdsOn",this.isAdOn);
  }

  enabled(e){
    console.log("e",e)
    let formObj = new FormData();
    // if(e.target.checked === true)
    // {
      formObj.append( "schoolId",this.userInfo.schoolid)
      formObj.append("isAdsOn",e.target.checked)
      // alert("Enabled");
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(
          this.url +
            "bully-buddy/admin/enable_ads",
          formObj
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.UserInfo.isAdsOn = e.target.checked;
            localStorage.setItem("UserInfo",JSON.stringify(this.UserInfo));
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message, type: true },
            });
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        },error => {
          console.log('oops', error)
        });
    });
  // }
  }
}
