import { Component, OnInit } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
// import { Properties } from '../../properties';
import { LocationStrategy } from "@angular/common";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import { Router } from "@angular/router";
import { SuccessComponent } from "../success/success.component";

@Component({
  selector: 'app-approve-school',
  templateUrl: './approve-school.component.html',
  styleUrls: ['./approve-school.component.css']
})
export class ApproveSchoolComponent implements OnInit {
 //Pagination
  data: Array<any>;
  totalRecords: Number;
  page: Number = 1;
  //Search
  searchText: any;
  selectedState = null;
  selectedZipCode = null;
  stateItems = [];
  zipCodeItem = [];
  constructor(private http: HttpClient,
     public alertDialog: MatDialog,
    public dialog: MatDialog,
    private property: PropertyServiceService,
    private location: LocationStrategy,
    private router: Router,
    private cookieService: CookieService
    ) {
      //Pagination
    this.data = new Array<any>();

    let scope = this;
    dialog.afterAllClosed.subscribe((res) => {
      this.ngOnInit();
    });
    }

     userInfo = JSON.parse(localStorage.getItem("UserInfo"));

  // url = this.property.url;
  // uri: string = "https://54.215.34.67:5001/bully-buddy/school/get_all_school";
  uri = this.property.uri;
  dataList: any = [];
  imgList: any;
  structImgList: any;
  structCatList: any;
  showSuperAdmin: boolean = false;
  orderFlag: boolean = false;
  showNoRecord: boolean = false;
  // imgPath = this.property.url;
  stateList: any = [];
  getCookies: string = this.cookieService.get("LoginStatus");

  ngOnInit() {

    console.log("COOKIE", this.getCookies);
    if (this.getCookies !== "login") {
      localStorage.removeItem("userInfo");
      this.router.navigateByUrl("/login");
    }
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      this.router.navigateByUrl("/login");
    }
    this.preventBackButton();
    if (this.userInfo.schoolid === 0) {
      this.showSuperAdmin = true;
      this.getAllApprpveSchools();
    }
    // this.order();
  }
 preventBackButton() {
    history.pushState(null, null, location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }
  getAllApprpveSchools(){
    return new Promise((resolve, reject) => {
      let formObj={
        isApproved:0
      }
      this.http
        .post(this.uri + "bully-buddy/approvedschools/get_all_schools_to_approve", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            this.data = res.result;
            this.totalRecords = res.result.length;
            // this.zipCodeItem.push(this.dataList.zipCode);
            // console.log("TOTOAL", this.totalRecords);
            console.log("TOTOAL", this.dataList);
            if (this.totalRecords === 0) {
              this.showNoRecord = true;
            }
            for (let i = 0; i < this.totalRecords; i++) {
              if (
                this.dataList[i].zipCode !== undefined ||
                this.dataList[i].zipCode !== "" ||
                this.dataList[i].zipCode !== null
              ) {
                if (this.zipCodeItem[i] !== this.dataList[i].zipCode) {
                  this.zipCodeItem.push(this.dataList[i].zipCode);
                }
              }

              // });
            }
            // console.log("zipCodeItem", this.zipCodeItem);
          } else {
            alert(res.message + " : " + res.result);
            this.showNoRecord = true;
          }
          resolve();
        });
    });
  }

  approveSchool(list)
  {
     return new Promise((resolve, reject) => {
      let formObj={
        id:list
      }
      this.http
        .post(this.uri + "bully-buddy/approvedschools/approve_school", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
           
           this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School Approved", type: true },
          });
         
          } else {
            alert(res.message + " : " + res.result);
           
          }
          resolve();
        });
    });
  }

rejectSchool(list)
  {
     return new Promise((resolve, reject) => {
      let formObj={
        id:list
      }
      this.http
        .post(this.uri + "bully-buddy/approvedschools/reject_school", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
           
             this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School rejected", type: true },
          });
         
          } else {
            alert(res.message + " : " + res.result);
           
          }
          resolve();
        });
    });
  }


   order() {
    if (!this.orderFlag) {
      this.dataList.sort((a, b) => {
        return b.id - a.id;
      });
    } else {
      this.dataList.sort((a, b) => {
        return a.id - b.id;
      });
    }
    this.orderFlag = !this.orderFlag;
  }
}
