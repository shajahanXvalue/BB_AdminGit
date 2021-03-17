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
import * as moment from 'moment';
import {IMyDpOptions} from 'mydatepicker';
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
  orderByd: string = 'schoolName';
  reverse: boolean = false;
  visibleClear: boolean = false;
  //Search
  searchText: any;
  fromDate:any;
  toDate:any;
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'mm.dd.yyyy',
    width:'11%',
    height:'21px',
    inline:false,


};
public myDatePickerOptions2: IMyDpOptions = {
  // other options...
  dateFormat: 'mm.dd.yyyy',
  width:'11%',
  height:'21px',
  inline:false,

};
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
    this.getAllBusRoute();
    if (this.userInfo.schoolid === 0) {
      this.showSuperAdmin = true;

    }
    //  else {
    //   this.getBusRouteById();
    // }
  }
  searchTeacher(eve){
    if(eve === ""){
      this.searchText = eve;
    }

  }

    showClear(eve){
    if(eve !==""){
        this.visibleClear = true;
    }
    else{
      this.visibleClear = false;
      this.getAllBusRoute();
    }

  }

clearResult(){
  // alert("HIT");
  this.visibleClear = false;
  this.searchText="";
  // this.searchWord="";
  this.getAllBusRoute();
}
// dateChanged(event,id){
dateChanged(event){
  console.log("FromDate",event.formatted)
  let date =  moment(event.formatted).format("YYYY-MM-DD")
  if(event.formatted !== undefined &&event.formatted !==""&&event.formatted !==" "){
    this.fromDate= date+' 00:00:00';
  }else{
    this.fromDate ="null"
  }

  // console.log("date", date);
  // console.log("id",);
  // console.log("date", this.fromDate);
  // if(event.target.id === "from" && event.target.value !== ""){
  //   console.log("From",event.target.value)
  //   this.fromDate = event.target.value+' 00:00:00'
  //   this.fromDateBind = event.target.value;
  // }
  // else if(event.target.id === "from" && event.target.value === ""){
  //   this.fromDate = "null"
  // }
  // else if(event.target.id === "to"&& event.target.value !== ""){
  //   this.toDate = event.target.value+' 00:00:00'
  //   this.toDateBind = event.target.value;
  // }
  // else if(event.target.id === "to" && event.target.value === ""){
  //   this.toDate = "null"
  // }

  console.log("from date", this.fromDate);
  console.log("to date", this.toDate);
}
// dateChanged2(event,id){
dateChanged2(event){
  console.log("ToDAte",event.formatted)
  let date =  moment(event.formatted).format("YYYY-MM-DD")
  if(event.formatted !== undefined && event.formatted !==""){
    this.toDate = date+' 00:00:00';
  }else{
    this.toDate ="null"
  }

  // console.log("id",);
  // console.log("date", this.toDate);
  // if(event.target.id === "from" && event.target.value !== ""){
  //   console.log("From",event.target.value)
  //   this.fromDate = event.target.value+' 00:00:00'
  //   this.fromDateBind = event.target.value;
  // }
  // else if(event.target.id === "from" && event.target.value === ""){
  //   this.fromDate = "null"
  // }
  // else if(event.target.id === "to"&& event.target.value !== ""){
  //   this.toDate = event.target.value+' 00:00:00'
  //   this.toDateBind = event.target.value;
  // }
  // else if(event.target.id === "to" && event.target.value === ""){
  //   this.toDate = "null"
  // }

  console.log("from date", this.fromDate);
  console.log("to date", this.toDate);
}

  getAllBusRoute() {
    let formObj = {
      schoolId: this.userInfo.schoolid,
    };
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/busroute/get_all_busroute", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            this.data = res.result;
            console.log("this.data",this.data);
            // let unique = this.data.filter((value, index, self) => self.map(x => x.name).indexOf(value.name) == index)

            // console.log("Unique_name",unique);

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
    return new Promise<void>((resolve, reject) => {
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
        createdDateTime: list.createdDateTime
      },
    });
  }

  deleteBusRoute(id) {
    var confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: "20%",
      data: {
        title: "Delete BusRoute",
        message: "Are you want to delete this BusRoute?",
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
    let from = null;
    let to = null;
    if(this.fromDate !== undefined && this.toDate !== null){
      from = this.fromDate
    }
    if(this.toDate !== undefined && this.toDate !== null){
      to = this.toDate
    }
    let url = "https://bullyingbuddyapp.com/java-service-admin/api/excel/download_busroute"+  "?schoolId=" + this.userInfo.schoolid+ "&from=" + from+ "&to=" + to;
    this.http.post(url,"", { responseType: "blob" }).subscribe((data) => {
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

  setOrder(value: string) {
    if (this.orderByd === value) {
      this.reverse = !this.reverse;
    }

    this.orderByd = value;
  }
}
