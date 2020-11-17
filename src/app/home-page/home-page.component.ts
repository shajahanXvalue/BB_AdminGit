import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { LocationStrategy } from "@angular/common";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import { Router } from "@angular/router";
import { SuccessComponent } from '../success/success.component';

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"],
})
export class HomePageComponent implements OnInit {
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
    private location: LocationStrategy,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.data = new Array<any>();
    dialog.afterAllClosed.subscribe(() => {
      // if (this.userInfo.schoolid === 0) {
      if (this.getCookies !== "login") {
        // alert("HIT");
        localStorage.removeItem("userInfo");
        // this.router.navigateByUrl("/login");
        // window.location.href = "/login";
        window.location.href="http://3.128.136.18/admin/#/login";
      }
      // else {
      this.getAllTeacher();
      // }

      // } else {
      //   this.getTeacherById();
      // }
    });
  }
  userInfo = JSON.parse(localStorage.getItem("UserInfo"));
getCookies: string = this.cookieService.get("LoginStatus");
  // url = this.property.url;
  // uri: string = "https://54.215.34.67:5001/bully-buddy/school/get_all_school";
  uri = this.property.uri;
  dataList: any = [];
  showNoRecord: boolean = false;
  showSuperAdmin: boolean = false;
  orderFlag: boolean = false;
  visibleClear: boolean = false;
  searchWord:any;

  ngOnInit() {
    // console.log(this.userInfo.id);
    this.getAllTeacher();
    console.log("COOKIE", this.getCookies);
    if (this.getCookies !== "login") {
      // alert("HIT");
      localStorage.removeItem("userInfo");
      // this.router.navigateByUrl("/login");
      window.location.href="http://3.128.136.18/admin/#/login";
    }
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      // this.router.navigateByUrl("/login");
      window.location.href="http://3.128.136.18/admin/#/login";
    }
  }
  getAllTeacher() {
    let formObj = {
      schoolId: this.userInfo.schoolid,
    };
    return new Promise((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/teachers/get_all_teacher", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            this.data = res.result;
            this.totalRecords = res.result.length;
          } else {
            alert(res.message + " : " + res.result);
          }
          if(this.totalRecords === 0 || this.totalRecords === undefined){
              this.showNoRecord = true;
            }else
            {
              this.showNoRecord = false;
            }
          resolve();
        });
    });
  }
  getTeacherById() {
    let arrLen: any = [];
    let formObj = {
      id: this.userInfo.schoolid,
    };
    return new Promise((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/teachers/get_teacher_by_id", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            // this.dataList.push(res.result);
            // this.dataList.push(this.dataList);
            arrLen.push(res.result);
            console.log("RESsss", arrLen);
            if (arrLen.length === 1 || arrLen[0].length === 1) {
              this.dataList = [];
              this.dataList.push(res.result);
              this.data = res.result;
              this.totalRecords = res.result.length;
            } else {
              this.dataList = res.result;
              this.data = res.result;
              this.totalRecords = res.result.length;
            }

            console.log("DATALIST", this.dataList);
          } else {
            alert(res.message + " : " + res.result);
          }
          if(this.totalRecords === 0 || this.totalRecords === undefined){
              this.showNoRecord = true;
            }else
            {
              this.showNoRecord = false;
            }
          resolve();
        });
    });
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
      this.getAllTeacher();
    }

  }

clearResult(){
  // alert("HIT");
  this.visibleClear = false;
  this.searchText="";
  this.searchWord="";
  this.getAllTeacher();
}

  addTeacher() {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: { title: "Add Teacher", divType: "addTeacher" },
    });
  }
  editTeacher(list) {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Edit Teacher",
        divType: "editTeacher",
        id: list.id,
        school_id: list.schoolId,
        teacher_name: list.teacherName,
        grade: list.grade,
      },
    });
  }

  deleteTeacher(id) {
    var confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: "20%",
      data: {
        title: "Delete Teacher",
        message: "Are you want to delete this Teacher!",
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
          .post(this.uri + "bully-buddy/teachers/delete_teacher", formObj)
          .subscribe((res: any) => {
            if (res.status == "200") {
              // if (this.userInfo.schoolid === 0) {
              //   this.showSuperAdmin = true;
              this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Teacher Deleted", type: true },
          });
              this.getAllTeacher();
              // } else {
              //   this.getTeacherById();
              // }
            }else{
              this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "BusRoute Delete failed", type: false },
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
        title: "Upload Teacher Excel",
        divType: "UploadExcel",
        fileName: "teacher",
      },
    });
  }
  excelDownload() {
    let url = "http://3.128.136.18:5001/api/excel/download_teacher";
    this.http.get(url, { responseType: "blob" }).subscribe((data) => {
      console.log("BLOB", data);
      const blob = new Blob([data], {
        type: "application/vnd.ms.excel",
      });
      const file = new File([blob], "teacher" + ".xlsx", {
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
