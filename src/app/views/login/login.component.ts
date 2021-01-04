// import { CookieService } from 'angular2-cookies/services/cookies.service';
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { SuccessComponent } from "../../success/success.component";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { PropertyServiceService } from "../../property-service.service";
// import { CookieService } from "ngx-cookie-service";
import { CookieService } from "angular2-cookie/core";
// import { CookieService } from "ngx-cookie";
@Component({
  selector: "app-dashboard",
  templateUrl: "login.component.html",
})
export class LoginComponent {
  userid: any;
  username: any;
  password: any;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    // private httpParams: HttpParams,
    private property: PropertyServiceService,
    private cookieService: CookieService
  ) {}
  url = this.property.uri;
  ngOnInit() {
    this.cookieService.remove("LoginStatus");
    localStorage.removeItem("UserInfo");
    localStorage.removeItem("States");
    localStorage.removeItem("doc");
    localStorage.removeItem("chatList");
    localStorage.removeItem("OneChatcount");
    localStorage.removeItem("GroupChatUserlength");
    localStorage.removeItem("GroupChatUsercount");
    localStorage.removeItem("allchatCount");
    localStorage.removeItem("OneChatUsercount");
    localStorage.removeItem("GroupChatUserCount");
    localStorage.removeItem("OneChatUserLength");
  }
  login() {
    if (this.username !== "" && this.password !== "") {
      // localStorage.setItem("SuperAdmin", this.userid);
      // this.router.navigateByUrl("/dash");
      let formObj = {
        // schoolid: this.userid,
        username: this.username,
        password: this.password,
      };

      this.http
        .post(this.url + "bully-buddy/admin/admin_login", formObj)
        .subscribe((res: any) => {
          console.log("res",res)
          if (res.status == "200") {
            let resData = JSON.stringify(res.result);
            // console.log("REs" + resData);
            // localStorage.setItem("SuperAdmin", this.userid);
            // document.cookie = "loginstatus=loggedin";
            this.cookieService.put("LoginStatus", "login");
            localStorage.setItem("UserInfo", resData);
            this.router.navigateByUrl("/dash");
          }
          else {
            this.dialog.open(SuccessComponent, {
              width: "20%",
              data: {
                value: "NetWork Error or Service Unavailable",
                type: false,
              },
            });
          }
          if (res.message === "School Id Not Found") {
            alert(
              res.message + " Please Enter the Correct UserName and Password!."
            );
          } else if (res.status == "400"||
            res.status == "401" ||
            res.message == "Invalid Credentials" || res.message =="Please enter valid details"
          ) {
          //   let resData = JSON.stringify(res.result);
          //   this.cookieService.put("LoginStatus", "login");
          // localStorage.setItem("UserInfo", resData);
          // this.router.navigateByUrl("/dash");
            this.dialog.open(SuccessComponent, {
              width: "20%",
              data: {
                value: "Enter valid UserName and Password",
                type: false,
              },
            });
          }

        });
    }
  }
  resetPassword() {
    this.router.navigateByUrl("/resetpassword");
  }
}
