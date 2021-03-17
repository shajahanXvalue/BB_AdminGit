import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import * as moment from "moment";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import {IMyDpOptions} from 'mydatepicker';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';
import { IDayCalendarConfig, DatePickerComponent } from "ng2-date-picker";

@Component({
  selector: "app-sub-service",
  templateUrl: "./sub-service.component.html",
  styleUrls: ["./sub-service.component.css"],
})
export class SubServiceComponent implements OnInit {
  //Pagination
  data: Array<any>;
  totalRecords: Number;
  page: Number = 1;
  itemPerPage = 50;
  totalResult: any;
  totalPages:any;
  fromDate:any;
  toDate:any;
  age:any;
  fromDateBind:any;
  toDateBind:any=new Date();
  // getCookies: string = this.cookieService.get("LoginStatus");
  //Search
  orderByd: string = 'schoolName';
  reverse: boolean = false;
  alphaSort:boolean =false;
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

//  public datePickerConfig=<IDayCalendarConfig>{
//     format:'MM.DD.YYYY',
//     displayDate:"string"
//   }
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

myDpOptions: IAngularMyDpOptions = {
  inline: false,
  dateRange: false,
  dateFormat: 'mm.dd.yyyy'
  // other options are here...
};

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private property: PropertyServiceService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.data = new Array<any>();

    // let scope = this;
    dialog.afterAllClosed.subscribe(() => {
      // if (this.schoolId.schoolid === 0) {
      //   this.isSuperAdmin = true;
      // this.getAllIncedents();
      this.ngOnInit();
      // } else {
      //   this.getIncidentsById();
      // }
    });
  }

  fileUrl = this.property.fileUrl3;
  // imgPath = this.property.url;
  dataList: any;
  subCatList: any;
  schoolId = JSON.parse(localStorage.getItem("UserInfo"));
  imgList: any;
  structImgList: any;
  structSubSerList: any;
  isSuperAdmin: boolean = false;
  orderFlag: boolean = false;
  showNoRecord: boolean = false;
  visibleClear: boolean = false;
  searchWord:any;
  url = this.property.uri;
  getCookies: string = this.cookieService.get("LoginStatus");
  // pagedItems: Array<any>;
  ngOnInit() {
    console.log("cookie", this.getCookies);
    this.toDateBind = moment(Date().toString())
    if (this.getCookies === "") {
      console.log("NAVIGATE");
      localStorage.removeItem("userInfo");
      // this.router.navigateByUrl("/login");
      window.location.href = "https://bullyingbuddyapp.com/admin/#/login";
    }
    if (this.schoolId === null || this.schoolId === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      // this.router.navigateByUrl("/login");
      window.location.href = "https://bullyingbuddyapp.com/admin/#/login";
    } else if (this.schoolId !== null) {
      this.getAllIncedents();
    }
    // if (this.schoolId.schoolid === 0) {
    //   this.isSuperAdmin = true;

    // } else {
    //   this.getIncidentsById();
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
  reset(){

    this.toDate= "null"
  }
  pageChanged(event) {
    // this.page = event;
    console.log("pagination", event);
     if(event!==""){
        this.page = event;
      if(event > this.totalPages){
        this.page = 1
      }
    if((this.searchText === ""||this.searchText === undefined)&&(this.age === ""||this.age === undefined)&&(this.fromDate === ""||this.fromDate === undefined)){
      this.getAllIncedents();
    }
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
      this.getAllIncedents();
    }

  }

clearResult(){
  // alert("HIT");
  this.visibleClear = false;
  this.searchText="";
  this.searchWord="";
  this.getAllIncedents();
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
  this.search();
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
  this.search();
  console.log("from date", this.fromDate);
  console.log("to date", this.toDate);
}
  getAllIncedents() {
    let arrLen: any = [];
    let page = this.page.toString();
    let pageNo: number = +page;
    pageNo = pageNo-1  ;
    return new Promise<void>((resolve, reject) => {
      let formObj = {
        schoolId: this.schoolId.schoolid,
      };
      this.http
        .post(this.url + "bully-buddy/incident/get_all_incident"+ "?pageno=" + pageNo, formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result.content;
            // console.log("INCEdents", this.dataList);
            arrLen.push(res.result.content);
            // if (arrLen[0].length === 1) {
            //   this.dataList = [];
            //   this.dataList.push(res.result);
            // } else {
            this.dataList = res.result.content;
            this.data = res.result.content;
            this.totalRecords = res.result.content.length;
            this.totalRecords = res.result.totalElements;
            this.totalResult = res.result.totalelements;
            this.itemPerPage = res.result.pageable.pageSize;
            this.totalPages = res.result.totalPages;
            if (this.totalRecords === 0) {
              this.showNoRecord = true;
            }
            else {
              this.showNoRecord = false;
            }
          } else {
            this.showNoRecord = false;
          }
          resolve();
        });
    });
  }

  getIncidentsById() {
    let arrLen: any = [];
    let formObj = {
      id: this.schoolId.schoolid,
    };
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.url + "bully-buddy/incident/get_incident_by_id", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            // console.log("INCEdents", this.dataList);
            arrLen.push(res.result);
            if (arrLen[0].length === 1 || arrLen.length === 1) {
              this.dataList = [];
              this.dataList.push(res.result);
              this.data = res.result;
              this.totalRecords = res.result.length;
              // console.log("INCITOTAL", this.totalRecords);
            } else {
              this.dataList = res.result;
              this.data = res.result;
              this.totalRecords = res.result.length;
              // console.log("INCITOTAL", this.totalRecords);
            }
          }
          resolve();
        });
    });
  }

  addincident() {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: { title: "Add Incidents", divType: "addIncidents" },
    });
  }
  editIncident(list) {
    console.log("LIST", list);
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Edit Incidents",
        divType: "editIncident",
        id: list.id,
        userId: list.userId,
        name: list.name,
        grade: list.grade,
        school_id: list.schoolId,
        age: list.age,
        gender: list.gender,
        bullyName: list.bullyName,
        incidentPlace: list.incidentPlace,
        isBullyClassmate: list.isBullyClassmate,
        bullyGender: list.bullyGender,
        noOfDaysBullied: list.noOfDaysBullied,
        bullyType: list.bullyType,
        bullyDescription: list.bullyDescription,
        videoURL: list.videoURL,
        bullyStatus: list.bullyStatus,
      },
    });
  }
  deleteIncident(id) {
    var confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: "22%",
      data: {
        title: "Delete Incidents",
        message: "Are you want to delete this Incidents!",
      },
    });
    confirmResult.afterClosed().subscribe((result: boolean) => {
      if (result) {
        let formObj = {
          id: id,
        };
        this.http
          .post(this.url + "bully-buddy/incident/delete_incident", formObj)
          .subscribe((res: any) => {
            if (res.status == "200") {
              // if (this.schoolId.schoolid === 0) {
              //   this.isSuperAdmin = true;
              this.getAllIncedents();
              // } else {
              //   this.getIncidentsById();
              // }
            }
          });
      }
    });
  }
  searchAge(eve){
    if(eve === undefined && eve === ""){
      this.age = "0";
    }else if(this.age >= 23){
      this.age = "22"
    }
    else{
      this.age = eve;
      this.age = this.age.toString();
    }
    this.search();
  }
  searchUser(eve) {
    const arrLen: any = [];
    let searchWord = eve;
    let to;
    let from;
    let age;
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
    if(this.age === undefined || this.age === "" || this.age === null){
      age ="0";
    }
    else{
      age = this.age;
    }
// console.log("searcTexts",this.searchText);
    if (this.searchText === "") {
      // alert("hi");
      this. getAllIncedents();
    }
    if(this.searchText !== undefined)
    {
    if (this.searchText !== "" && this.searchText.length > 1) {
      this.http
        .post(
          this.url +
            "bully-buddy/incident/search_incidents" +
            "?searchword=" +
            searchWord+ "&from=" + from+ "&to=" + to+ "&age=" +age+ "&schoolId=" + this.schoolId.schoolid,""
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
            // }
            if(this.totalRecords === 0){
              this.showNoRecord = true;
            }
            else{
              this.showNoRecord = false;
            }
          }
        });
    }
    // console.log("this.datalisttt",this.dataList);

  }
  }
  search(){
    return new Promise<void>((resolve, reject) => {
      let from;
      let to;
      let search;
      let age;
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
      if(this.age === undefined || this.age === "" || this.age === null){
        age ="0";
      }
      else{
        age = this.age;
      }
      let formObj={
        searchword:search,
        from:from,
        to:to
      }
      if(search==="null"&&from==="null"&&to==="null"&&age==="0"){
        this.getAllIncedents();
      }
      else{
      this.http
        .post(
          this.url + "bully-buddy/incident/search_incidents"+ "?searchword=" + search+ "&from=" + from+ "&to=" + to+ "&age=" +age+ "&schoolId=" + this.schoolId.schoolid,"")
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
            this.showNoRecord = false;
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
      }
    });
  }
  dayFilter(eve) {
    var today = moment();
    // const from_date = today.startOf("week");
    // const to_date = today.endOf("week");
    console.log("EVEnt", eve);
    if (eve === "1: All") {
      // this.searchText = "";
      // this.dataList = this.data;
      // this.totalRecords = this.dataList.length;
      this.getAllIncedents();
    }
    if (eve === "2: Daily") {
      // let arrayList = [];
      // this.dataList = this.data;
      let date = moment(today).format("YYYY-MM-DD");
      this.fromDate = date+" 00:00:00"
      this.toDate = "null"
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
      this.fromDate = from_date+" 00:00:00"
      this.toDate = "null";
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
      this.fromDate = from_date+" 00:00:00"
      this.toDate = "null";
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
    let url = "https://bullyingbuddyapp.com/java-service-admin/api/excel/download_incident"+ "?schoolId=" + this.schoolId.schoolid+  "&from=" + from+ "&to=" + to;
    this.http.post(url,"" ,{ responseType: "blob" }).subscribe((data) => {
      console.log("BLOB", data);
      const blob = new Blob([data], {
        type: "application/vnd.ms.excel",
      });
      const file = new File([blob], "incident" + ".xlsx", {
        type: "application/vnd.ms.excel",
      });
      saveAs(file);
    });
  }

fileOpen(list) {debugger
    let fileURl;
    let file = list;
    let type;
    let defaultImage="No";
    // let type = list.substr(list.indexOf(".") + 1, list.length);

    if(file!="url"||file!=undefined||file!=null){
    type = list.substr(list.length - 3);
    file = file.toString();
    console.log("TYPE", type);
    if (file.includes("uploads")) {
      fileURl = this.fileUrl + list;
    } else {
      fileURl = this.fileUrl + list;
    }
    }
    else{
      type="NoFile"
    }
    if(file.includes("images/Group+10178")){
      defaultImage = "DefaultImage"
    }
    // console.log("fileURl", fileURl);
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Incident Attachment",
        divType: "openFile",
        fileURL: fileURl,
        type: type,
        defaultImage:defaultImage
      },
    });
  }

  order() {
    if (!this.orderFlag) {
      // this.dataList.sort((a, b) => b.id.localeCompare(a.id));
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
this.alphaSort=!this.alphaSort;
    this.orderByd = value;
  }
}
