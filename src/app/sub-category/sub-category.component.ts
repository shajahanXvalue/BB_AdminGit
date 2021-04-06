import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import { saveAs } from "file-saver";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { SuccessComponent } from '../success/success.component';
import { OrderPipe } from 'ngx-order-pipe';
import * as moment from 'moment';
import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: "app-sub-category",
  templateUrl: "./sub-category.component.html",
  styleUrls: ["./sub-category.component.css"],
})
export class SubCategoryComponent implements OnInit {
  // Pagination
  orderByd: string = 'schoolName';
  reverse: boolean = false;
  alphaSort:boolean =false;
  sortedCollection: any[];
  userData: Array<any>;
  totalUserRecords: Number;
  page: Number = 1;
  itemPerPage = 50;
  // getCookies: string = this.cookieService.get("LoginStatus");
  // Search
  searchText: any;
  // Day Filter
  selectedValue= null;
  fromDate:any;
  toDate:any;
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
    public alertDialog: MatDialog,
    private property: PropertyServiceService,
    private router: Router,
    private cookieService: CookieService,
    private orderPipe: OrderPipe
  ) {
    this.sortedCollection = orderPipe.transform(this.dataList, 'list.schoolName');
    this.userData = new Array<any>();

    dialog.afterAllClosed.subscribe(() => {
      // if (this.schoolId.schoolid === 0) {
      //   this.isSuperAdmin = true;
      // this.getAllUser();
      this.ngOnInit();
      // } else {
      //   this.getUserById();
      // }
    });
  }
  url = this.property.uri;
  totalResult: any;
  totalPages:any;
  dataList: any;
  schoolId = JSON.parse(localStorage.getItem("UserInfo"));
  orderFlag: boolean = false;
  isSuperAdmin: boolean = false;
  showNoRecord: boolean = false;
  showPagination:boolean=false;
  searchWord:any;
  visibleClear:boolean = false;
  // imgPath = this.property.url;
  // showNoRecord:boolean =false;
  getCookies: string = this.cookieService.get("LoginStatus");
  ngOnInit() {
    if (this.getCookies === "") {
      localStorage.removeItem("userInfo");
      this.router.navigateByUrl("/login");
      // window.location.href = this.url+"admin/#/login";
      // window.location.href="https://bullyingbuddyapp.com/admin/#/login";
    }
    if (this.schoolId === null || this.schoolId === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      this.router.navigateByUrl("/login");
      // window.location.href = "/login";
      // window.location.href="https://bullyingbuddyapp.com/admin/#/login";
    }
    if (this.schoolId.schoolid === 0) {
      this.isSuperAdmin = true;
    }
    console.log("this.searchText",this.searchText);
    if(this.searchText === "" || this.searchText === undefined)
    {
      console.log("this.searchTextt",this.searchText);
        this.getAllUser();
    }
    else{
      console.log("this.searchText Hit")
      this.searchWord = this.searchText;
      this.searchUser(this.searchText)
    }

    // } else {
    //   this.getUserById();
    // }
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
    this.getAllUser();
    }
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
 showClear(eve){
    if(eve !==""){
        this.visibleClear = true;
    }
    else{
      this.visibleClear = false;
      this.getAllUser();
    }

  }

clearResult(){
  // alert("HIT");
  this.visibleClear = false;
  this.searchText="";
  this.searchWord="";
  this.getAllUser();
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
    this.getAllUser();
  }
  if (eve === "2: Daily") {
    // let arrayList = [];
    // this.dataList = this.data;
    let date = moment(today).format("YYYY-MM-DD");
    this.fromDate = date+" 00:00:00"
    this.toDate = date+" 00:00:00"
    this.search();
    console.log("Today", date.toString());
  }
  if (eve === "3: Weekly") {
    const from_date = today.startOf("isoWeek").format("YYYY-MM-DD");
    const to_date = today.endOf("isoWeek").format("YYYY-MM-DD");
    this.fromDate = from_date+ " 00:00:00";
    this.toDate = to_date+ " 00:00:00";
    this.search();
  }
  if (eve === "4: Monthly") {
    // let arrayList = [];
    this.dataList = this.userData;
    const from_date = today.startOf("month").format("YYYY-MM-DD");
    const to_date = today.endOf("month").format("YYYY-MM-DD");
    this.fromDate = from_date+" 00:00:00"
    this.toDate = to_date+ " 00:00:00";
    this.search();
  }
  if (eve === "5: Yearly") {
    let arrayList = [];
    this.dataList = this.userData;
    const from_date = today.startOf("year").format("YYYY-MM-DD");
    const to_date = today.endOf("year").format("YYYY-MM-DD");
    this.fromDate = from_date+" 00:00:00"
    this.toDate = to_date+ " 00:00:00";
    this.search();
    console.log("Search", this.searchText);
  }

  // console.log("DATE", fromDate);
}

  getAllUser() {
    const arrLen: any = [];
    const formObj = {
      schoolid: this.schoolId.schoolid,
      // pageno: 1,
    };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    let page = this.page.toString();
    let pageNo: number = +page;
    pageNo = pageNo - 1;
    console.log("Page", pageNo);
    // page = page - 1;
    this.http
      .post(
        this.url + "bully-buddy/admin/get_all_user" + "?pageno=" + pageNo,
        formObj, {headers: config()}
      )
      .subscribe((res: any) => {
        if (res.status == "200") {
          // this.
          // const dataList = res.result;
          // console.log("USer", dataList);
          arrLen.push(res.result.content);
          // if (arrLen[0].length === 1) {
          //   this.dataList = [];
          //   this.dataList.push(res.result.content);
          //   this.userData = res.result.content;
          //   this.totalUserRecords = res.result.totalElements;
          // } else {
          this.dataList = res.result.content;
          this.userData = res.result.content;
          this.totalUserRecords = res.result.totalElements;
          this.totalResult = res.result.totalelements;
          this.itemPerPage = res.result.pageable.pageSize;
          this.totalPages = res.result.totalPages;
          // console.log("USer", this.dataList);
          // }
          if(this.totalUserRecords>0){

            this.showPagination=true;
          }
          if(this.totalUserRecords<=0){
            this.showNoRecord=true;
          }
        }else if(res.status == "400"){
          this.showNoRecord=true;
        }
      },error => {
        console.log('oops', error);
        if (error.status === 504){
        alert("You have been logout");
          this.router.navigateByUrl("/login");
        }
      });
  }

  getUserById() {
    const arrLen: any = [];
    const formObj = {
      id: this.schoolId.schoolid,
    };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    this.http
      .post(this.url + "bully-buddy/user/get_user_by_id", formObj, {headers: config()})
      .subscribe((res: any) => {
        if (res.status == "200") {
          // this.
          this.dataList = res.result;
          // console.log("USer", this.dataList);
          arrLen.push(res.result);
          // console.log("ARR", arrLen.length);
          if (arrLen[0].length === 1 || arrLen.length === 1) {
            this.dataList = [];
            this.dataList.push(res.result);
            this.userData = res.result;
            this.totalUserRecords = res.result.length;
          } else {
            this.dataList = res.result;
            this.userData = res.result;
            this.totalUserRecords = res.result.length;
          }
        }
      },error => {
        console.log('oops', error);
        if (error.status === 504){
        alert("You have been logout");
          this.router.navigateByUrl("/login");
        }
      });
  }
  excelUpload() {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      // height: "100%",
      data: {
        title: "Upload User Excel",
        divType: "UploadExcel",
        fileName: "user",
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
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    const url = this.url+"api/excel/download" +  "?schoolId=" + this.schoolId.schoolid+ "&from=" + from+ "&to=" + to;
    this.http.post(url,"", { responseType: "blob", headers: config()}).subscribe((data) => {
      console.log("BLOB", data);
      const blob = new Blob([data], {
        type: "application/vnd.ms.excel",
      });
      const file = new File([blob], "user" + ".xlsx", {
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
  addUser() {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      // height: "100%",
      data: {
        title: "Add User",
        divType: "addUser",
      },
    });
  }
  editUser(list) {
    console.log("CreatedData:",list.createdDateTime)
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Edit User",
        divType: "editUser",
        id: list.id,
        email: list.email,
        schoolId: list.schoolId,
        userSchoolName: list.schoolName,
        userTypeId: list.userTypeId,
        name: list.name,
        age:list.age,
        ccUser:list.ccUser,
        userPhone: list.userPhone,
        parentId: list.parentId,
        grade: list.grade,
        parentPhone1: list.parentPhone1,
        parentPhone2: list.parentPhone2,
        driverPhone: list.driverPhone,
        schoolPhone: list.schoolPhone,
        gender: list.gender,
        address: list.address,
        zipCode: list.zipCode,
        city: list.city,
        state: list.state,
        busRoute: list.busRoute,
        createdDateTime: list.createdDateTime,
        userLang: list.userLang,
        profileImage: list.profileImage
      },
    });
  }
  deleteDriver(id)
  {
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    const formObj = {
      id:id,
    };
    this.http
    .post(this.url + "bully-buddy/user/delete_driver", formObj, {headers: config()})
    .subscribe((res: any) => {
      if (res.status == "200") {
        // if (this.schoolId.schoolid === 0) {
        //   this.isSuperAdmin = true;
        let confirmdelResult = this.dialog.open(DeleteDialogComponent, {
          width: "22%",
          data: {
            title: "Delete User",
            message: res.message,
          },
        });
        confirmdelResult.afterClosed().subscribe((result: boolean) => {
          if (result) {
            const formObj = {
              id: id,
            };
            this.http
              .post(this.url + "bully-buddy/user/delete_user", formObj, {headers: config()})
              .subscribe((res: any) => {
                if (res.status == "200") {
                  // if (this.schoolId.schoolid === 0) {
                  //   this.isSuperAdmin = true;
                   this.alertDialog.open(SuccessComponent, {
                width: "30%",
                data: { value: "User Deleted", type: true },
              });
                  if(this.searchText ===" " || this.searchText === undefined){
                      this.getAllUser();
                  }
                  else{
                    this.searchUser(this.searchWord);
                  }

                }else{
                   this.alertDialog.open(SuccessComponent, {
                width: "30%",
                data: { value: "User Deleted Failed", type: false },
              });
                }
              },error => {
                console.log('oops', error);
                if (error.status === 504){
                alert("You have been logout");
                  this.router.navigateByUrl("/login");
                }
              });
          }
        });

        if(this.searchText ===" " || this.searchText === undefined){
            this.getAllUser();
        }
        else{
          this.searchUser(this.searchWord);
        }

      }else{
        this.alertDialog.open(SuccessComponent, {
          width: "30%",
          data: { value: res.message, type: false },
        });
      }
    },error => {
      console.log('oops', error);
      if (error.status === 504){
      alert("You have been logout");
        this.router.navigateByUrl("/login");
      }
    });
  }

  deleteUser(list) {
    let confirmResult;
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    let message=list.id===this.schoolId.userId?"Can't delete this admin as you currently Signed-In.":"Are you want to delete this User!";
    if(list.type==="Student"||list.type === "Parent"){
      message= "Are you want to delete this User?, After deleting this user your parent-child relationship will be removed.";
    }
    // if(list.type === "Bus Driver"){
    //   message= "Are you want to delete this User?, After deleting this user bus-route associated with this user will be removed.";
    // }
    if(list.id===this.schoolId.userId){
      this.alertDialog.open(SuccessComponent, {
        width: "30%",
        data: { value: message, type: false },
      });
    }
    else{
    confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: "22%",
      data: {
        title: "Delete User",
        message: message,
      },
    });
  }
    confirmResult.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const formObj = {
          id: list.id,
        };
        this.http
          .post(this.url + "bully-buddy/user/delete_user", formObj, {headers: config()})
          .subscribe((res: any) => {
            if (res.status == "200") {
              // if (this.schoolId.schoolid === 0) {
              //   this.isSuperAdmin = true;
               this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "User Deleted", type: true },
          });
              if(this.searchText ===" " || this.searchText === undefined){
                  this.getAllUser();
              }
              else{
                this.searchUser(this.searchWord);
              }

            }else{
               this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "User Deleted Failed", type: false },
          });
            }
          },error => {
            console.log('oops', error);
            if (error.status === 504){
            alert("You have been logout");
              this.router.navigateByUrl("/login");
            }
          });
      }
    });
  }

  search(){
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
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
        this.getAllUser();
      }
      else{
      this.http
        .post(
          this.url + "bully-buddy/user/search_user"+ "?searchword=" + search+ "&from=" + from+ "&to=" + to+"&schoolId="+this.schoolId.schoolid,"", {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            this.userData = res.result;
            this.totalUserRecords = res.result.length

            console.log("Report",res.result);
           }
           if(this.totalUserRecords===0){
            this.showNoRecord=true;
            this.showPagination=true;
          }
          else{
            this.showNoRecord=false;
          }
          //  else {
          //   alert(res.message + " : " + res.result);
          // }
          resolve();
        },error => {
          console.log('oops', error);
          if (error.status === 504){
          alert("You have been logout");
            this.router.navigateByUrl("/login");
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
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
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
      this.getAllUser();
    }
    if(this.searchText !== undefined)
    {
    if (this.searchText !== "" && this.searchText.length > 1) {
      this.http
        .post(
          this.url +
            "bully-buddy/user/search_user" +
            "?searchword=" +
            searchWord+ "&from=" + from+ "&to=" + to+"&schoolId="+this.schoolId.schoolid,
          "", {headers: config()}
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
            this.userData = res.result;
            this.totalUserRecords = res.result.length;
            // }
          }
          if(this.totalUserRecords>0){

            this.showPagination=true;
          }
          if(this.totalUserRecords<0){
            this.showNoRecord=true;
          }
        },error => {
          console.log('oops', error);
          if (error.status === 504){
          alert("You have been logout");
            this.router.navigateByUrl("/login");
          }
        });
    }
    // console.log("this.datalisttt",this.dataList);
    // if(this.dataList === ""){
    //   this.showNoRecord = true;
    // }
    // else{
    //   this.showNoRecord = false;
    // }
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
this.alphaSort=!this.alphaSort;
    this.orderByd = value;
  }
}
