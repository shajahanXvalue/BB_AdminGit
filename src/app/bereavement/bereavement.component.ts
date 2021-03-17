import { Component, OnInit } from '@angular/core';
import { LocationStrategy, DatePipe } from "@angular/common";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
// import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { OrderPipe } from 'ngx-order-pipe';
import {IMyDpOptions} from 'mydatepicker';
@Component({
  selector: 'app-bereavement',
  templateUrl: './bereavement.component.html',
  styleUrls: ['./bereavement.component.css']
})
export class BereavementComponent implements OnInit {

  //Pagination
  data: Array<any>;
  totalRecords: Number;
  totalElements: Number;
  page: Number = 1;
  totalResult: any;
  totalPages:any;
  itemPerPage = 50;
  fromDate:string;
  toDate:string;
  age:any;
  // getCookies: string = this.cookieService.get("LoginStatus");
  //Search
  searchText: any;
  searchWord:any;
  //Day Filter
  selectedValue = null;
  // datePipe=DatePipe;
  orderByd: string = 'school';
  alphaSort:boolean = false;
  reverse: boolean = false;
  showNoRecord: boolean = false;
  visibleClear:boolean = false;
  sortedCollection: any[];
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
  constructor( private http: HttpClient,
    public dialog: MatDialog,
    private property: PropertyServiceService,
    private router: Router,
    private datePipe: DatePipe,
    private orderPipe: OrderPipe,
    private cookieService: CookieService)
    {
      this.sortedCollection = orderPipe.transform(this.dataList, 'list.school');
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

  // url = this.property.url;
  fileUrl = this.property.fileUrl3;
  uri = this.property.uri;
  dataList: any = [];
  schoolList: any = [];
  totalSchool: any;
  showSuperAdmin: boolean = false;
  orderFlag: boolean = false;
  schoolName: any = [];
  getCookies: string = this.cookieService.get("LoginStatus");

  ngOnInit(): void {
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
    this.getAllBereavement();
    if (this.userInfo.schoolid === 0) {

      this.showSuperAdmin = true;

    }
    // else {
    //   this.getReportById();
    // }
    if(this.searchText === "" || this.searchText === undefined)
    {
      console.log("this.searchTextt",this.searchText);
        this.getAllBereavement();
    }
    else{
      console.log("this.searchText Hit")
      this.searchWord = this.searchText;
      this.searchUser(this.searchText)
    }
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
  showClear(eve){
    if(eve !==""){
        this.visibleClear = true;
    }
    else{
      this.visibleClear = false;
      this.getAllBereavement();
    }

  }

clearResult(){
  // alert("HIT");
  this.visibleClear = false;
  this.searchText="";
  this.searchWord="";
  this.getAllBereavement();
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
      this. getAllBereavement();
    }
    if(this.searchText !== undefined)
    {
    if (this.searchText !== "" && this.searchText.length > 1) {
      this.http
        .post(
          this.uri +
            "bully-buddy/bereavement/search_bereavement" +
            "?searchword=" +
            searchWord+ "&from=" + from+ "&to=" + to+ "&age=" +age,""
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
            // this.totalElements = res
            if(this.totalRecords === 0){
              this.showNoRecord = true;
            }
            else{
              this.showNoRecord = false;
            }
            // }
          }
          else{
            this.showNoRecord = false;
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
        this.getAllBereavement()
      }
      else
      {
      this.http
        .post(
          this.uri + "bully-buddy/bereavement/search_bereavement"+ "?searchword=" + search+ "&from=" + from+ "&to=" + to+ "&age=" +age,"")
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            this.data = res.result;
            this.totalRecords = res.result.length
            if(this.totalRecords === 0){
              this.showNoRecord = true;
            }
            else{
              this.showNoRecord = false;
            }
            console.log("Report",res.result);
           } else {
            this.showNoRecord = true;
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
      }
    });
  }
   getAllBereavement() {
    let formObj = {
      schoolid: this.userInfo.schoolid,
    };
    // + "?pageno=" + pageNo
    // let pageNo=0;
    let page = this.page.toString();
    let pageNo: number = +page;
    pageNo = pageNo - 1;
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(
          this.uri + "bully-buddy/bereavement/get_all_bereavement" + "?pageno=" + pageNo, formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result.content;
            this.data = res.result.content;
            console.log("Report", this.dataList);
            // this.totalRecords = res.result.content.length;
            this.totalRecords = res.result.totalElements;
            this.totalResult = res.result.totalelements;
            this.itemPerPage = res.result.pageable.pageSize;
            this.totalPages = res.result.totalPages;
            if(this.totalRecords === 0){
              this.showNoRecord = true;
            }
            else{
              this.showNoRecord = false;
            }
          } else {
            this.showNoRecord = true;
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
    let defaultImage="No";
    let fileURL=this.property.fileUrl3
    console.log("File",file);
    // let type = list.substr(list.indexOf(".") + 1, list.length);
    // console.log("File",file.length);
    if(file!==""||file!==undefined||file!==null){
    type = list.substr(list.length - 3);
    file = file.toString();
// console.log("TYPELEn",type.length)
if(type === "peg"){
  type = "jpeg";
}
    if(type.length>=3){
    if (file.includes("uploads")) {
      fileURl = this.fileUrl + list;
    }
    else {
      fileURl = this.fileUrl + list;
    }
  }
  else{
      type="NoFile"
    }
    }else{
      type="NoFile"
    }
    if(file.includes("images/Group+10178")){
      defaultImage = "DefaultImage"
    }
// console.log("TYPE", type);
    // console.log("fileURl", fileURl);
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Bereavement Attachment",
        divType: "openFile",
        fileURL: fileURl,
        type: type,
        defaultImage:defaultImage
      },
    });
  }

  excelDownload() {
    let from = "null";
    let to = "null";
    if(this.fromDate !== undefined && this.fromDate !== null){
      from = this.fromDate
    }
    if(this.toDate !== undefined && this.toDate !== null){
      to = this.toDate
    }
    const url = "https://bullyingbuddyapp.com/java-service-admin/api/excel/download_bereavement" + "?from=" + from+ "&to=" + to;
    this.http.post(url,"", { responseType: "blob" }).subscribe((data) => {
      console.log("BLOB", data);
      const blob = new Blob([data], {
        type: "application/vnd.ms.excel",
      });
      const file = new File([blob], "bereavements" + ".xlsx", {
        type: "application/vnd.ms.excel",
      });
      saveAs(file);
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
      this.fromDate ="null";
      this.toDate = "null";
      this.getAllBereavement();
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

  editBereavement(list) {
    console.log("list", list.school);
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Edit Bereavement",
        divType: "editbereavement",
        name: list.name,
        age: list.age,
        school: list.school,
        id: list.id,
        school_state: list.stateName,
        story: list.story,
        schoolDistrict: list.schoolDistrict,
        createdDateTime: list.createdDateTime
      },
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

  pageChanged(event) {
    // this.page = event;
    console.log("pagination", event);
     if(event!==""){
        this.page = event;
      if(event > this.totalPages){
        this.page = 1
      }
    if((this.searchText === ""||this.searchText === undefined)&&(this.age === ""||this.age === undefined)&&(this.fromDate === ""||this.fromDate === undefined)){
    this.getAllBereavement();
    }
  }
  }
  setOrder(value: string) {
    if (this.orderByd === value) {
      this.reverse = !this.reverse;
    }
    this.alphaSort= !this.alphaSort;
    this.orderByd = value;
  }

}
