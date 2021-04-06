import { Component, OnInit } from "@angular/core";
import { LocationStrategy } from "@angular/common";
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-states",
  templateUrl: "./states.component.html",
  styleUrls: ["./states.component.css"],
})
export class StatesComponent implements OnInit {
  //Pagination
  data: Array<any>;
  totalRecords: Number;
  page: Number = 1;

  //Search
  searchText: any;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private property: PropertyServiceService,
    private router: Router,
    private cookieService: CookieService
  ) {
    //Pagination
    this.data = new Array<any>();
  }

  userInfo = JSON.parse(localStorage.getItem("UserInfo"));

  // url = this.property.url;
  uri = this.property.uri;
  dataList: any = [];
  showNoRecords: boolean = false;
  showSuperAdmin: boolean = false;
  orderFlag: boolean = false;
  getCookies: string = this.cookieService.get("LoginStatus");

  ngOnInit() {
    if (this.getCookies !== "login") {
      localStorage.removeItem("userInfo");
      this.router.navigateByUrl("/login");
      // window.location.href = "/admin/#/login";
    }
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      this.router.navigateByUrl("/login");
      // window.location.href = "/admin/#/login";
    }
    this.getAllState();
  }
  getAllState() {
    // let formObj = {
    //   schoolId: this.userInfo.schoolid,
    // };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/state/get_all_state",'',{headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            this.data = res.result;
            this.totalRecords = res.result.length;
            if (this.totalRecords === 0) {
              this.showNoRecords = true;
            }
          } else if (res.status === 504){
            // this.alertDialog.open(SuccessComponent, {
            //   width: "30%",
            //   data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            // });
            alert(res.message + " : " + res.result+ "You have been logout");
            this.router.navigateByUrl("/login");
          }else {
            alert(res.message + " : " + res.result);
            this.showNoRecords = true;
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
  }
  excelDownload() {
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    let url = this.uri+"bully-buddy/excel/download_state";
    this.http.post(url, '', { responseType: "blob" , headers: config()}).subscribe((data) => {
      console.log("BLOB", data);
      const blob = new Blob([data], {
        type: "application/vnd.ms.excel",
      });
      const file = new File([blob], "state" + ".xlsx", {
        type: "application/vnd.ms.excel",
      });
      saveAs(file);
    },error => {
      console.log('oops', error);
      if (error.status === 504){
      alert("You have been logout");
        this.router.navigateByUrl("/login");
      }
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
