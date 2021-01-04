import { Component, OnInit } from "@angular/core";
import { LocationStrategy, DatePipe } from "@angular/common";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
// import { DatePipe } from "@angular/common";
import * as moment from 'moment';
import {IMyDpOptions} from 'mydatepicker';
@Component({
  selector: "app-emergency-report",
  templateUrl: "./emergency-report.component.html",
  styleUrls: ["./emergency-report.component.css"],
})
export class EmergencyReportComponent implements OnInit {
  //Pagination
  data: Array<any>;
  totalRecords: Number;
  page: Number = 1;
  itemPerPage = 50;
  totalResult: any;
  totalPages:any;
  fromDate:any;
  toDate:any;
  // getCookies: string = this.cookieService.get("LoginStatus");
  //Search
  searchText: any;
  //Day Filter
  selectedValue = null;
  // datePipe=DatePipe;
  optionItems = [
    { id: "0", value: "All", text: "All" },
    { id: "1", value: "Daily", text: "Daily" },
    { id: "2", value: "Weekly", text: "Weekly" },
    { id: "3", value: "Monthly", text: "Monthly" },
    { id: "4", value: "Yearly", text: "Yearly" },
  ];
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
    private property: PropertyServiceService,
    private router: Router,
    private datePipe: DatePipe,
    private cookieService: CookieService
  ) {
    //Pagination
    this.data = new Array<any>();

    dialog.afterAllClosed.subscribe(() => {
      // if (this.userInfo.schoolid === 0) {
      // this.getAllReport();
      this.ngOnInit();
      // } else {
      //   this.getReportById();
      // }
    });
  }
  userInfo = JSON.parse(localStorage.getItem("UserInfo"));
  orderByd: string = 'schoolName';
  reverse: boolean = false;
  sortedCollection: any[];
  // url = this.property.url;
  fileUrl = this.property.fileUrl3;
  uri = this.property.uri;
  dataList: any = [];
  schoolList: any = [];
  totalSchool: any;
  showSuperAdmin: boolean = false;
  orderFlag: boolean = false;
  alphaSort:boolean=false;
  showNoRecord: boolean = false;
  visibleClear: boolean = false;
  searchWord:any;
  schoolName: any = [];
  getCookies: string = this.cookieService.get("LoginStatus");
  ngOnInit() {
    // console.log(this.userInfo.id);
    if (this.getCookies !== "login") {
      localStorage.removeItem("userInfo");
      // this.router.navigateByUrl("/login");
      // window.location.href = "/login";
      window.location.href="https://bullyingbuddyapp.com/admin/#/login";
    }
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      // this.router.navigateByUrl("/login");
      // window.location.href = "/login";
      window.location.href="https://bullyingbuddyapp.com/admin/#/login";
    }
    // if (this.userInfo.schoolid === 0) {
    //   this.showSuperAdmin = true;
    this.getAllReport();
    // } else {
    //   this.getReportById();
    // }
    if(this.searchText === "" || this.searchText === undefined)
    {
      console.log("this.searchTextt",this.searchText);
        // this.getAllReport();
    }
    else{
      console.log("this.searchText Hit")
      this.searchWord = this.searchText;
      this.searchUser(this.searchText)
    }
  }

  searchReport(eve){
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
      this.getAllReport();
    }

  }

clearResult(){
  // alert("HIT");
  this.visibleClear = false;
  this.searchText="";
  this.searchWord="";
  this.getAllReport();
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
  this.search();
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
  this.search();
  console.log("from date", this.fromDate);
  console.log("to date", this.toDate);
}

  getAllReport() {
    let page = this.page.toString();
    let pageNo: number = +page;
    pageNo = pageNo - 1;
    let formObj = {
      schoolId: this.userInfo.schoolid,
    };
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(
          this.uri + "bully-buddy/emergencyreport/get_all_emergencyreport"+ "?pageno=" + pageNo,
          formObj
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result.content;
            this.data = res.result.content;
            console.log("Report", this.dataList);
            this.totalRecords = res.result.length;
            this.totalRecords = res.result.totalElements;
          this.totalResult = res.result.totalelements;
          this.itemPerPage = res.result.pageable.pageSize;
          this.totalPages = res.result.totalPages;
            if(this.totalRecords === 0 || this.totalRecords === undefined){
              this.showNoRecord = true;
            }else
            {
              this.showNoRecord = false;
            }

            // this.getAllSchools();
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
  }
  getReportById() {
    let arrLen: any = [];
    let formObj = {
      id: this.userInfo.schoolid,
    };
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(
          this.uri + "bully-buddy/emergencyreport/get_emergencyreport_by_id",
          formObj
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            // this.dataList.push(res.result);
            // this.dataList.push(this.dataList);
            arrLen.push(res.result);
            console.log("RESsss", arrLen);
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
             if(this.totalRecords === 0 || this.totalRecords === undefined){
              this.showNoRecord = true;
            }else
            {
              this.showNoRecord = false;
            }
            console.log("DATALIST", this.dataList);
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
  }
  getAllSchools() {
    // this.totalRecords = 0;
    // this.page = 1;
    let schoolName = [];
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/school/get_all_school", "")
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.schoolList = res.result;
            // this.data = res.result;
            this.totalSchool = res.result.length;
            console.log("SCHOOLLIST", this.schoolList);
            console.log("DATALIST", this.dataList);
            // this.zipCodeItem.push(this.dataList.zipCode);
            // console.log("TOTOAL", this.totalRecords);
            // console.log("TOTOAL", this.dataList);
            for (let i = 0; i < this.totalRecords; i++) {
              if (this.dataList[i].schoolId !== 0) {
                for (let j = 0; j < this.totalSchool; j++) {
                  if (
                    this.schoolList[j].schoolName !== undefined ||
                    this.schoolList[j].schoolName !== "" ||
                    this.schoolList[j].schoolName !== null
                  ) {
                    if (this.schoolList[j].id === this.dataList[i].schoolId) {
                      schoolName.splice(i, 0, this.schoolList[j].schoolName);
                    }
                  }
                }

                // break;
              } else if (this.dataList[i].schoolId === 0) {
                schoolName.splice(i, 0, "null");
              }
              // });
            }

            // schoolName.map((item, index) => {
            // for (let h = 0; h <= this.totalRecords; h++) {
            //   this.data.splice(h, 0, ...this.data, schoolName[h]);
            // }
            // });
            this.schoolName = schoolName;
            console.log("zipItem", this.data);
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
  }

  fileOpen(list) {
    let fileURl;
    let file = list;
    let type;
    // let type = list.substr(list.indexOf(".") + 1, list.length);
    // console.log("File",file);
    if(file!==""||file!==undefined||file!==null){
    type = list.substr(list.length - 3);
    file = file.toString();
    console.log("TYPE", type);
    if (file.includes("uploads")) {
      fileURl = this.fileUrl + list;
    } else {
      fileURl = this.fileUrl + list;
    }
    }else{
      type="NoFile"
    }

    // console.log("fileURl", fileURl);
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Emergency Report Attachment",
        divType: "openFile",
        fileURL: fileURl,
        type: type,
      },
    });
  }

  addReport() {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: { title: "Add Emergency Report", divType: "addReport" },
    });
  }
  editReport(list) {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Edit Emergency Report",
        divType: "editReport",
        id: list.id,
        userId: list.userId,
        school_id: list.schoolId,
        fileURL: list.fileURL,
        latitude: list.latitude,
        langitude: list.langitude,
        address: list.address,
      },
    });
  }

  deleteReport(id) {
    var confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: "30%",
      data: {
        title: "Delete Emergency Report",
        message: "Are you want to delete this Emergency Report!",
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
          .post(
            this.uri + "bully-buddy/emergencyreport/delete_emergencyreport",
            formObj
          )
          .subscribe((res: any) => {
            if (res.status == "200") {
              // if (this.userInfo.schoolid === 0) {
              //   this.showSuperAdmin = true;
              this.getAllReport();
              // } else {
              //   this.getTeacherById();
              // }
            }
          });
      }
    });
  }

  searchUser(eve) {
    const arrLen: any = [];
    let searchWord = eve;
    let to;
    let from;

    if(this.toDate === undefined){
        to="null"
    }
    else{
      to = this.toDate;
    }
    if(this.fromDate === undefined){
      from="null"
  }
  else{
    from = this.fromDate;
  }
    // console.log("searchWord",this.searchWord);
    if(this.searchWord === "" || this.searchWord === undefined){
      this.searchText = eve;
    }
    else{
      this.searchText = this.searchWord;
    }
// console.log("searcTexts",this.searchText);
    if (this.searchText === "") {
      // alert("hi");
      this. getAllReport();
    }
    if(this.searchText !== undefined)
    {
    if (this.searchText !== "" && this.searchText.length > 1) {
      this.http
        .post(
          this.uri +
            "bully-buddy/emergencyreport/search_emergency_report" +
            "?searchword=" +
            searchWord+ "&from=" + from+ "&to=" + to+"&schoolId="+this.userInfo.schoolid,""
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            // console.log("searchUser", res.result);
            arrLen.push(res.result);
            // if (arrLen[0].length === 1) {
            //   this.dataList = [];
            //   this.dataList.push(res.result);
            //   this.userData = res.result;
            //   this.totalUserRecords = res.result.length;
            // } else {
            this.dataList = res.result;
            // this.userData = res.result;
            this.totalRecords = res.result.length;
            if(this.totalRecords === 0){
              this.showNoRecord = true;
            }
            else{
              this.showNoRecord = false;
            }
            // }
          }
          else{
            this.showNoRecord = true;
          }
        });
    }
    // console.log("this.datalisttt",this.dataList);
    if(this.dataList === ""){
      this.showNoRecord = true;
    }
    else{
      this.showNoRecord = false;
    }
  }
  }

  search(){
    return new Promise<void>((resolve, reject) => {
      let from;
      let to;
      let search;
      if(this.fromDate === undefined){
        from="null"
    }
    else{
      from = this.fromDate;
    }
      if(this.toDate === undefined){
          to="null"
      }
      else{
        to = this.toDate;
      }
      if(this.searchWord === undefined || this.searchWord === null|| this.searchWord === ""){
        search = "null"
      }
      else{
        search = this.searchWord
      }
      let formObj={
        searchword:search,
        from:from,
        to:to
      }
      if(search==="null"&&from==="null"&&to==="null"){
        this.getAllReport();
      }
      else{
      this.http
        .post(
          this.uri + "bully-buddy/emergencyreport/search_emergency_report"+ "?searchword=" + search+ "&from=" + from+ "&to=" + to+"&schoolId="+this.userInfo.schoolid,"")
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            this.data = res.result;
            this.totalRecords = res.result.length
            console.log("Report",res.result);
            if(this.totalRecords === 0){
              this.showNoRecord = true;
            }
            else{
              this.showNoRecord = false;
            }
           } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
      }
    });
  }
  dayFilter(eve) {
    var today = moment();
    console.log("EVE",eve)
    // const from_date = today.startOf("week");
    // const to_date = today.endOf("week");
    console.log("EVEnt", eve);
    if (eve === "1: All") {
      // this.searchText = "";
      // this.dataList = this.data;
      // this.totalRecords = this.dataList.length;
      this.fromDate ="null";
      this.toDate = "null";
      this.getAllReport();
    }
    if (eve === "2: Daily") {
      // let arrayList = [];
      // this.dataList = this.data;
      let date = moment(today).format("YYYY-MM-DD");
      this.fromDate = date+" 00:00:00"
      this.toDate = date+" 00:00:00"
      this.search();
      // for (let j = 0; j < this.dataList.length; j++) {
      //   if (this.dataList[j].modifiedDateTime !== undefined) {
      //     var modifiedDateTime = moment(
      //       this.dataList[j].modifiedDateTime
      //     ).format("MM-DD-YYYY");
      //     var DateTime = modifiedDateTime.toString();
      //   }

      //   if (DateTime === date) {
      //     arrayList.push(this.dataList[j]);
      //   }
      // }
      // this.totalRecords = arrayList.length;
      // this.searchText = date.toString();
      console.log("Today", date.toString());
    }
    if (eve === "3: Weekly") {
      const from_date = today.startOf("isoWeek").format("YYYY-MM-DD");
      const to_date = today.endOf("isoWeek").format("YYYY-MM-DD");
      this.fromDate = from_date+ " 00:00:00";
      this.toDate = to_date+ " 00:00:00";
      this.search();
      // let arrayList = [];
      // for (let i = 0; i < 7; i++) {
      //   var new_date = moment(from_date, "YYYY-MM-DD")
      //     .add(i, "days")
      //     .format("YYYY-MM-DD");
      //   new_date = new_date.toString();

      //   for (let j = 0; j < this.dataList.length; j++) {
      //     if (this.dataList[j].modifiedDateTime !== undefined) {
      //       var modifiedDateTime = moment(
      //         this.dataList[j].modifiedDateTime
      //       ).format("YYYY-MM-DD");
      //       var DateTime = modifiedDateTime.toString();
      //     }

      //     if (DateTime === new_date) {
      //       arrayList.push(this.dataList[j]);
      //     }
      //   }
      // }
      // console.log("DATA", arrayList);
      // this.dataList = arrayList;
      // this.searchText = "";
      // this.totalRecords = this.dataList.length;
      // console.log("example", this.dataList);
    }
    if (eve === "4: Monthly") {
      // let arrayList = [];
      this.dataList = this.data;
      const from_date = today.startOf("month").format("YYYY-MM-DD");
      const to_date = today.endOf("month").format("YYYY-MM-DD");
      this.fromDate = from_date+" 00:00:00"
      this.toDate =to_date+" 00:00:00";
      this.search();
      // for (let j = 0; j < this.dataList.length; j++) {
      //   if (this.dataList[j].modifiedDateTime !== undefined) {
      //     var modifiedDateTime = moment(
      //       this.dataList[j].modifiedDateTime
      //     ).format("YYYY-MM");
      //     var DateTime = modifiedDateTime.toString();
      //   }

      //   if (DateTime === new_date) {
      //     arrayList.push(this.dataList[j]);
      //   }
      // }
      // this.totalRecords = this.dataList.length;
      // this.searchText = from_date.toString();
      // console.log("Search", this.searchText);
    }
    if (eve === "5: Yearly") {
      let arrayList = [];
      this.dataList = this.data;
      const from_date = today.startOf("year").format("YYYY-MM-DD");
      const to_date = today.endOf("year").format("YYYY-MM-DD");
      this.fromDate = from_date+" 00:00:00"
      this.toDate = to_date+" 00:00:00";
      console.log("DATE", this.fromDate);
      console.log("DATE",  this.toDate);
      this.search();
      // for (let j = 0; j < this.dataList.length; j++) {
      //   if (this.dataList[j].modifiedDateTime !== undefined) {
      //     var modifiedDateTime = moment(
      //       this.dataList[j].modifiedDateTime
      //     ).format("YYYY");
      //     var DateTime = modifiedDateTime.toString();
      //   }

      //   if (DateTime === new_date) {
      //     arrayList.push(this.dataList[j]);
      //   }
      // }
      // this.totalRecords = this.dataList.length;
      // this.searchText = from_date.toString();
      console.log("Search", this.searchText);
    }

    // console.log("DATE", fromDate);
  }

  excelDownload() {
    let from = null;
    let to = null;
    // console.log("frommmmm",this.fromDate)
    if(this.fromDate !== undefined && this.fromDate !== null){
      from = this.fromDate
    }
    if(this.toDate !== undefined && this.toDate !== null){
      to = this.toDate
    }

    const url = "https://bullyingbuddyapp.com/java-service-admin/api/excel/download_emergencyreport" + "?schoolId=" + this.userInfo.schoolid+ "&from=" + from+ "&to=" + to;
    this.http.post(url,"", { responseType: "blob" }).subscribe((data) => {
      console.log("BLOB", data);
      const blob = new Blob([data], {
        type: "application/vnd.ms.excel",
      });
      const file = new File([blob], "user" + ".xlsx", {
        type: "application/vnd.ms.excel",
      });
      saveAs(file);
    });
  }

  pageChanged(event) {
    // this.page = event;
    console.log("pagination", event);
     if(event!==""){
        this.page = event;
      if(event > this.totalPages){
        this.page = 1
      }
    if((this.searchText === ""||this.searchText === undefined)&&(this.fromDate === ""||this.fromDate === undefined)){
      this.getAllReport();
    }
  }
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
