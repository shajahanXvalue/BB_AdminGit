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
import * as moment from 'moment';
import {IMyDpOptions} from 'mydatepicker';
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
  totalUserRecords: Number;
  itemPerPage = 50;
  orderByd: string = 'schoolName';
  reverse: boolean = false;
  //Search
  searchText: any;
  fromDate:any;
  toDate:any;
  totalPages:any;
  grade:any;
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
    private location: LocationStrategy,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.data = new Array<any>();
    dialog.afterAllClosed.subscribe(() => {

      if (this.getCookies !== "login") {
        // alert("HIT");
        localStorage.removeItem("userInfo");
        // this.router.navigateByUrl("/login");
        // window.location.href = "/login";
        window.location.href="https://bullyingbuddyapp.com/admin/#/login";
      }
      // else {
      this.getAllTeacher();
      // }
      if (this.userInfo.schoolid === 0) {
            this.showSuperAdmin = true;
      }
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
  alphaSort:boolean=false;
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
      window.location.href="https://bullyingbuddyapp.com/admin/#/login";
    }
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      // this.router.navigateByUrl("/login");
      window.location.href="https://bullyingbuddyapp.com/admin/#/login";
    }

  }
  pageChanged(event) {
    // this.page = event;
    console.log("pagination", event);
     if(event!==""){
        this.page = event;
      if(event > this.totalPages){
        this.page = 1
      }
    if((this.searchText === ""||this.searchText === undefined)&&(this.grade === ""||this.grade === undefined)&&(this.fromDate === ""||this.fromDate === undefined)){
      this.getAllTeacher();
    }
  }
  }
  dateChanged(event,id){
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
  dateChanged2(event,id){
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

  getAllTeacher() {
    let page = this.page.toString();
    let pageNo: number = +page;
    pageNo = pageNo - 1;
    console.log("Page", pageNo);
    let formObj = {
      schoolId: this.userInfo.schoolid,
    };
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/teachers/get_all_teacher" + "?pageno=" + pageNo, formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result.content;
            this.data = res.result.content;
            this.totalUserRecords = res.result.totalElements;
            this.totalRecords = res.result.totalElements;
            this.itemPerPage = res.result.pageable.pageSize;
            this.totalPages = res.result.totalPages;
            console.log(" this.dataList", this.dataList)
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
  searchGrade(eve){
    if(eve === undefined && eve === ""){
      this.grade = "0";
    }
    else{
      this.grade = eve;
      this.grade = this.grade.toString();
    }
    if(this.grade >=13){
      this.grade = "12";
    }
    return new Promise<void>((resolve, reject) => {

      let search = this.searchText;
     let grade;
      if(search === undefined || search === null|| search === ""){
        search = "null"
      }
      else{
        search = search
      }
      if(this.grade === undefined || this.grade === ""){
        grade = "0"
      }
      else{
        grade = this.grade.toString();
      }
      if(search==="null"&&grade==="0"){
        this.getAllTeacher();
      }
      else{
      this.http
        .post(
          this.uri + "bully-buddy/teachers/search_teachers"+ "?searchword=" + search+ "&grade=" + grade+"&schoolId="+this.userInfo.schoolid,"")
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            this.data = res.result;
            this.totalUserRecords = res.result.length
            this.totalRecords = res.result.length;
            console.log("Report",res.result);
           }
           if(this.totalUserRecords>0){

            this.showNoRecord=false;
          }
          if(this.totalUserRecords<=0){
            this.showNoRecord=true;
          }
          //  else {
          //   alert(res.message + " : " + res.result);
          // }
          resolve();
        });
      }
    });
  }
  search(eve){
    return new Promise<void>((resolve, reject) => {

      let search = eve;
     let grade;
      if(search === undefined || search === null|| search === ""){
        search = "null"
      }
      else{
        search = search
      }
      if(this.grade === undefined || this.grade === ""){
        grade = "0"
      }
      else{
        grade = this.grade.toString();
      }
      if(search==="null"&&grade==="0"){
        this.getAllTeacher();
      }
      else{
      this.http
        .post(
          this.uri + "bully-buddy/teachers/search_teachers"+ "?searchword=" + search+ "&grade=" + grade+"&schoolId="+this.userInfo.schoolid,"")
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            this.data = res.result;
            this.totalUserRecords = res.result.length
            this.totalRecords = res.result.length;
            console.log("Report",res.result);
           }
           if(this.totalUserRecords>0){

            this.showNoRecord=false;
          }
          if(this.totalUserRecords<=0){
            this.showNoRecord=true;
          }
          //  else {
          //   alert(res.message + " : " + res.result);
          // }
          resolve();
        });
      }
    });
  }

  getTeacherById() {
    let arrLen: any = [];
    let formObj = {
      id: this.userInfo.schoolid,
    };
    return new Promise<void>((resolve, reject) => {
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
        teacher_name: list.name,
        grade: list.grade,
        createdDateTime: list.createdDateTime,
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
    let from = null;
    let to = null;
    if(this.fromDate !== undefined && this.toDate !== null){
      from = this.fromDate
    }
    if(this.toDate !== undefined && this.toDate !== null){
      to = this.toDate
    }
    let url = "https://bullyingbuddyapp.com/java-service-admin/api/excel/download_teacher" + "?schoolId=" + this.userInfo.schoolid+  "&from=" + from+ "&to=" + to;
    this.http.post(url,"", { responseType: "blob" }).subscribe((data) => {
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
  setOrder(value: string) {
    if (this.orderByd === value) {
      this.reverse = !this.reverse;
    }
    this.alphaSort = !this.alphaSort;
    this.orderByd = value;
  }
}
