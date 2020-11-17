import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { SuccessComponent } from "../success/success.component";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { PropertyServiceService } from "../property-service.service";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { WindowService } from "./window.service";

var firebaseConfig = {
  apiKey: "AIzaSyBZZFCskTCE0NJDrmBiAe2fMb1__HN2thI",
  authDomain: "bullybuddy-2ad33.firebaseapp.com",
  databaseURL: "https://bullybuddy-2ad33.firebaseio.com",
  projectId: "bullybuddy-2ad33",
  storageBucket: "bullybuddy-2ad33.appspot.com",
  messagingSenderId: "471739578594",
  appId: "1:471739578594:web:c0807087960c41667446bb",
  measurementId: "G-D6XZLK4J9G",
};

export class PhoneNumber {
  country: string;
  area: string;
  prefix: string;
  line: string;

  //Format Phone No as E.164
  get e164() {
    // const num = this.country + this.area + this.prefix + this.line;
    const num = this.country+this.line;
    return `+${num}`;
  }
}
@Component({
  selector: "app-forgot-password-screen",
  templateUrl: "./forgot-password-screen.component.html",
  styleUrls: ["./forgot-password-screen.component.css"],
})
export class ForgotPasswordScreenComponent implements OnInit {
  username: any;
  mobileno: any;
  verifyCode: any;
  password: any;
  confirmPassword: any;
  windowRef: any;
  phoneNumber = new PhoneNumber();
  verificationCode: string;
  user: any;
  isRecaptcha: boolean = true;
  showVerify: boolean = false;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    // private httpParams: HttpParams,
    private property: PropertyServiceService,
    private win: WindowService
  ) {}
  url = this.property.uri;

  ngOnInit() {
    //Initialize the fireBase App if not Initialize before..

    if (!firebase.apps.length) {
      let fireApp = firebase.initializeApp(firebaseConfig);
    }

    //To Open the reCaptcha

    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: function (response) {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // verifyLoginCode();
        },
      }
    );

    //reCaptcha Renderm open
    this.windowRef.recaptchaVerifier.render();
  }

  //To Send the Verification Code after reCaptcha
  codeGen() {
    const appVerifier = this.windowRef.recaptchaVerifier;

    const num = this.phoneNumber.e164;

    firebase
      .auth()
      .signInWithPhoneNumber(num, appVerifier)
      .then((result) => {
        this.windowRef.confirmationResult = result;
        console.log("CODE", result);
        this.isRecaptcha = false;
        this.showVerify = true;
      })
      .catch((error) => console.log(error));
  }

  //To verify the entered code
  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then((result) => {
        this.user = result.user;
        this.showVerify = false;
      })
      .catch((error) => console.log(error, "Incorrect Code entered!"));
  }

  //To reset the Password
  resetPassword() {
    if (this.username !== "" && this.password !== "") {
      let formObj = {
        username: this.username,
        password: this.password,
      };

      this.http
        .post(this.url + "bully-buddy/admin/forgot_password", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            let resData = JSON.stringify(res.result);
            console.log("REs" + resData);
            if (res.message === "User not Found") {
              this.dialog.open(SuccessComponent, {
                width: "30%",
                data: { value: res.message, type: false },
              });
              // this.router.navigateByUrl("/login");
            } else {
              this.dialog.open(SuccessComponent, {
                width: "40%",
                data: { value: "Password Changed Success!", type: true },
              });
              this.router.navigateByUrl("/login");
            }
          }
        });
    } else {
      this.dialog.open(SuccessComponent, {
        width: "20%",
        data: { value: "Error in Changing Password!", type: false },
      });
    }
  }
}
