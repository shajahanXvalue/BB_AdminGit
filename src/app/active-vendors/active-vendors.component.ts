import { Component, OnInit } from "@angular/core";
import { LocationStrategy } from "@angular/common";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { SuccessComponent } from '../success/success.component';
@Component({
  selector: "app-active-vendors",
  templateUrl: "./active-vendors.component.html",
  styleUrls: ["./active-vendors.component.css"],
})
export class ActiveVendorsComponent implements OnInit {
  //Pagination
  data: Array<any>;
  totalRecords: Number;
  page: Number = 1;

  //Search
  searchText: any;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public alertDialog: MatDialog,
    private property: PropertyServiceService,
    private router: Router,
    private cookieService: CookieService
  ) {
    //Pagination
    this.data = new Array<any>();
    dialog.afterAllClosed.subscribe(() => {
      // if (this.userInfo.schoolid === 0) {
      this.getAllBusRoute();
      // } else {
      //   this.getBusRouteById();
      // }
    });
  }
  userInfo = JSON.parse(localStorage.getItem("UserInfo"));

  // url = this.property.url;
  uri = this.property.uri;
  dataList: any = [];
  showNoRecord: boolean = false;
  showSuperAdmin: boolean = false;
  orderFlag: boolean = false;
  getCookies: string = this.cookieService.get("LoginStatus");

  ngOnInit() {
    if (this.getCookies !== "login") {
      localStorage.removeItem("userInfo");
      this.router.navigateByUrl("/login");
    }
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      this.router.navigateByUrl("/login");
    }
    // console.log(this.userInfo);

    // if (this.userInfo.schoolid === 0) {
    //   this.showSuperAdmin = true;
    this.getAllBusRoute();
    // } else {
    //   this.getBusRouteById();
    // }
  }
  getAllBusRoute() {
    let formObj = {
      schoolId: this.userInfo.schoolid,
    };
    return new Promise((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/busroute/get_all_busroute", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            this.data = res.result;
            this.totalRecords = res.result.length;
            if (this.totalRecords === 0) {
              this.showNoRecord = true;
            }
            else{
              this.showNoRecord = false;
            }
          } else {
            alert(res.message + " : " + res.result);
            this.showNoRecord = true;
          }
          resolve();
        });
    });
  }
  getBusRouteById() {
    let arrLen: any = [];
    let formObj = {
      id: this.userInfo.schoolid,
    };
    return new Promise((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/busroute/get_busroute_by_id", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            // this.dataList.push(res.result);
            // this.dataList.push(this.dataList);
            arrLen.push(res.result);
            // console.log("RESsss", arrLen);
            if (arrLen.length === 1) {
              this.dataList = [];
              this.dataList.push(res.result);
              this.data = res.result;
              this.totalRecords = res.result.length;
            } else {
              this.dataList = res.result;
              this.data = res.result;
              this.totalRecords = res.result.length;
            }
            // console.log("DATALIST", this.dataList);
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
  }

  addBusRoute() {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: { title: "Add BusRoute", divType: "addBusRoute" },
    });
  }
  editBusRoute(list) {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Edit BusRoute",
        divType: "editBusRoute",
        id: list.id,
        busRoute: list.busRoute,
        driver_id: list.driverId,
        school_id: list.schoolId,
      },
    });
  }

  deleteBusRoute(id) {
    var confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: "20%",
      data: {
        title: "Delete BusRoute",
        message: "Are you want to delete this BusRoute!",
      },
    });
    confirmResult.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // let formObj = new FormData();
        // formObj.append("id", id);
        let formObj = {
          id: id,
        };
        this.http
          .post(this.uri + "bully-buddy/busroute/delete_busroute", formObj)
          .subscribe((res: any) => {
            if (res.status == "200") {
               this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "BusRoute Deleted", type: true },
          });
              // if (this.userInfo.schoolid === 0) {
              //   this.showSuperAdmin = true;
              this.getAllBusRoute();
              // } else {
              //   this.getTeacherById();
              // }
            }else{
               this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "BusRoute Deleted Failed", type: false },
          });
            }
          });
      }
    });
  }
  excelUpload() {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      // height: "100%",
      data: {
        title: "Upload BusRoute Excel",
        divType: "UploadExcel",
        fileName: "busroute",
      },
    });
  }
  excelDownload() {
    let url = "http://3.128.136.18:5001/api/excel/download_busroute";
    this.http.get(url, { responseType: "blob" }).subscribe((data) => {
      console.log("BLOB", data);
      const blob = new Blob([data], {
        type: "application/vnd.ms.excel",
      });
      const file = new File([blob], "busroute" + ".xlsx", {
        type: "application/vnd.ms.excel",
      });
      saveAs(file);
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
