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
@Component({
  selector: "app-sub-category",
  templateUrl: "./sub-category.component.html",
  styleUrls: ["./sub-category.component.css"],
})
export class SubCategoryComponent implements OnInit {
  // Pagination
  userData: Array<any>;
  totalUserRecords: Number;
  page: Number = 1;
  itemPerPage = 100;
  // getCookies: string = this.cookieService.get("LoginStatus");
  // Search
  searchText: any;
  // Day Filter
  selectedValue: any;

  optionItems = [
    { id: "1", value: "Daily", text: "Daily" },
    { id: "2", value: "Weekly", text: "Weekly" },
    { id: "3", value: "Monthly", text: "Monthly" },
    { id: "4", value: "Yearly", text: "Yearly" },
  ];
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public alertDialog: MatDialog,
    private property: PropertyServiceService,
    private router: Router,
    private cookieService: CookieService
  ) {
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
      // this.router.navigateByUrl("/login");
      // window.location.href = "/login";
      window.location.href="http://3.128.136.18/admin/#/login";
    }
    if (this.schoolId === null || this.schoolId === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      // this.router.navigateByUrl("/login");
      // window.location.href = "/login";
      window.location.href="http://3.128.136.18/admin/#/login";
    }
    // if (this.schoolId.schoolid === 0) {
    //   this.isSuperAdmin = true;
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
    if(this.searchText === ""||this.searchText === undefined){
    this.getAllUser();
    }
  }
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

  getAllUser() {
    const arrLen: any = [];
    const formObj = {
      schoolid: this.schoolId.schoolid,
      // pageno: 1,
    };

    let page = this.page.toString();
    let pageNo: number = +page;
    pageNo = pageNo - 1;
    console.log("Page", pageNo);
    // page = page - 1;
    this.http
      .post(
        this.url + "bully-buddy/admin/get_all_user" + "?pageno=" + pageNo,
        formObj
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
          if(this.totalUserRecords<0){
            this.showNoRecord=true;
          }
        }else if(res.status == "400"){
          this.showNoRecord=true;
        }
      });
  }

  getUserById() {
    const arrLen: any = [];
    const formObj = {
      id: this.schoolId.id,
    };
    this.http
      .post(this.url + "bully-buddy/user/get_user_by_id", formObj)
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
    const url = "http://3.128.136.18:5001/api/excel/download";
    this.http.get(url, { responseType: "blob" }).subscribe((data) => {
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
      },
    });
  }
  deleteUser(id) {
    let confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: "22%",
      data: {
        title: "Delete User",
        message: "Are you want to delete this User!",
      },
    });
    confirmResult.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const formObj = {
          id: id,
        };
        this.http
          .post(this.url + "bully-buddy/user/delete_user", formObj)
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
          });
      }
    });
  }
  searchUser(eve) {
    const arrLen: any = [];
    let searchWord = eve;
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
            searchWord,
          ""
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
