import { Component, OnInit,Inject } from '@angular/core';
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PropertyServiceService } from "../property-service.service";
import { SuccessComponent } from "../success/success.component";

import { CookieService } from "ngx-cookie-service";
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
    private property: PropertyServiceService, private cookieService: CookieService
   ) { }
    isAdOn:boolean = false;
    url = this.property.uri;
    UserInfo = JSON.parse(localStorage.getItem("UserInfo"));
    getCookies: string = this.cookieService.get("LoginStatus");
  ngOnInit() {
    if (this.getCookies !== "login") {
      localStorage.removeItem("userInfo");
      // this.router.navigateByUrl("/login");
      window.location.href = "#/login";
      // window.location.href="https://bullyingbuddyapp.com/admin/#/login";
    }
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      // this.router.navigateByUrl("/login");
      window.location.href = "#/login";
      // window.location.href="https://bullyingbuddyapp.com/admin/#/login";
    }
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
      const config=()=>{
        let token=localStorage.getItem("BBToken");
        if(token!=""){
        return {Authorization:`Bearer ${token}`}
        }
      }
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(
          this.url +
            "bully-buddy/admin/enable_ads",
          formObj, {headers: config()}
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.UserInfo.isAdsOn = e.target.checked;
            localStorage.setItem("UserInfo",JSON.stringify(this.UserInfo));
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message, type: true },
            });
          }else if (res.status === "504" || res.status === 504){
            // this.alertDialog.open(SuccessComponent, {
            //   width: "30%",
            //   data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            // });
            alert(res.message + " : " + res.result+ "You have been logout");
            this.router.navigateByUrl("/login");
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        },error => {
          console.log('oops', error);
          if (error.status === 504){
          alert("You have been logout");
            this.router.navigateByUrl("/login");
          }
        });
    });
  // }
  }
}
