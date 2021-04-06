import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
// import { Properties } from '../../properties';
import { LocationStrategy } from "@angular/common";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import { Router } from "@angular/router";
import { SuccessComponent } from '../success/success.component';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token",
    Accept: "*/*",
  }),
};

@Component({
  selector: "app-schools",
  templateUrl: "./schools.component.html",
  styleUrls: ["./schools.component.css"],
})
export class SchoolsComponent implements OnInit {
  //Pagination
  data: Array<any>;
  totalRecords: Number;
  page: Number = 1;
  itemPerPage = 500;
  //Search
  searchText: any;
  selectedState = null;
  selectedZipCode = null;
  stateItems = [];
  zipCodeItem = [];
  alphaSort: boolean = false;
  visibleClear: boolean = false;
  orderByd: string = 'schoolName';
  reverse: boolean = false;
  fromDate: any;
  toDate: any;
   constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private property: PropertyServiceService,
    private location: LocationStrategy,
    public alertDialog: MatDialog,
    private router: Router,
    private cookieService: CookieService
  ) {
    //Pagination
    this.data = new Array<any>();

    let scope = this;
    dialog.afterAllClosed.subscribe((res) => {
      // if (this.userInfo.schoolid === 0) {
      //   this.getAllSchools();
      // } else {
      //   this.getSchoolById();
      // }
      this.ngOnInit();
    });
  }

  userInfo = JSON.parse(localStorage.getItem("UserInfo"));

  // url = this.property.url;
  // uri: string = "https://54.215.34.67:5001/bully-buddy/school/get_all_school";
  uri = this.property.uri;
  dataList: any = [];
  imgList: any;
  structImgList: any;
  totalPages: any;
  structCatList: any;
  showSuperAdmin: boolean = false;
  orderFlag: boolean = false;
  showNoRecord: boolean = false;
  localschoolRec: any = [];
  // imgPath = this.property.url;
  stateList: any = [];
  searchWord: any;
  getCookies: string = this.cookieService.get("LoginStatus");
  ngOnInit() {
    // console.log(this.userInfo);
    this.getAllState();
    console.log("COOKIE", this.getCookies);
    if (this.getCookies !== "login") {
      localStorage.removeItem("userInfo");
      this.router.navigateByUrl("/login");
    }
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      this.router.navigateByUrl("/login");
    }
    this.preventBackButton();
    if (this.userInfo.schoolid === 0) {
      this.showSuperAdmin = true;
        //  console.log("this.searchText",this.searchText);
        if (this.searchText === "" || this.searchText === undefined)
            {
              // alert("hiii")
              // console.log("this.searchTextt",this.searchText);
              this.getAllSchools();
            }else{
                // console.log("this.searchText Hit")
                this.searchWord = this.searchText;
                this.schoolSearch(this.searchText)
    }

    } else {
      this.getSchoolById();
    }
    // this.order();
  }
  preventBackButton() {
    history.pushState(null, null, location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }
   pageChanged(event) {

    console.log("pagination", event);
    console.log("SelectedPAgeState", this.selectedState)
    console.log("SelectedPAgesearchText", this.searchText)
     if (event !== ""){
        this.page = event;
        if (event > this.totalPages){
            this.page = 1
      }
    if ((this.selectedState === null || this.selectedState === "") && (this.searchText === "" || this.searchText === undefined)){
      // alert("PageCHange")
        this.getAllSchools();
    }

     }

  }

  dateChanged(event){
    if (event.target.id === "from" && event.target.value !== ""){
      console.log("From", event.target.value)
      this.fromDate = event.target.value + ' 00:00:00'
    }
    else if (event.target.id === "from" && event.target.value === ""){
      this.fromDate = "null"
    }
    else if (event.target.id === "to" && event.target.value !== ""){
      this.toDate = event.target.value + ' 00:00:00'
    }
    else if (event.target.id === "to" && event.target.value === ""){
      this.toDate = "null"
    }
    this.search();
    console.log("from date", this.fromDate);
    console.log("to date", this.toDate);
  }

  setPage(eve){
    console.log("PageSizeCHange", eve)
  }

  getAllSchools() {
    // this.totalRecords = 0;
    let page = this.page.toString();
    let pageNo: number = +page;
  
    pageNo = pageNo - 1;
    console.log("Page", pageNo);
// let formObj={
//   pageno:pageNo
// }
const config = () => {
  let token = localStorage.getItem("BBToken");
  if (token != ""){
  return {Authorization: `Bearer ${token}`}
  }
}
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/school/get_all_school" + "?pageno=" + pageNo, '', {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result.content;
            this.totalRecords = res.result.totalElements;
            this.totalPages = res.result.totalPages;
            // console.log("TOTOAL", this.totalRecords);
            // console.log("SchoolResult",res.result)
            if (this.totalRecords === 0) {
              this.showNoRecord = true;
            }else{
              this.showNoRecord = false;
            }

          } 
          else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }
          else {
            // alert(res.message + " : " + res.result);
            this.showNoRecord = true;
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result, type: false },
            });

          }
          resolve();
          // this.getZipCode();
        },error => {
          console.log('oops', error);
          if (error.status === 504){
          alert("You have been logout");
            this.router.navigateByUrl("/login");
          }
        });

    });

  }
  getSchoolById() {
    let arrLen: any = [];
    let formObj = new FormData();
    formObj.append('id',this.userInfo.schoolid)
    
    const config = () => {
      let token = localStorage.getItem("BBToken");
      if (token != ""){
      return {Authorization: `Bearer ${token}`}
      }
    }
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/school/get_school_by_id", formObj, {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            // this.dataList.push(res.result);
            // this.dataList.push(this.dataList);
            // console.log("schoolreslt",res.result);
            arrLen.push(res.result);
            // console.log("RESsss", arrLen);
            if (arrLen.length === 1) {
              this.dataList = [];
              this.dataList.push(res.result);
              this.data = res.result;
              this.totalRecords = arrLen.length;
              this.totalPages = arrLen.length;
              this.getAllState();
            } else {
              this.dataList = res.result;
              this.data = res.result;
              this.totalRecords = res.result.length;
              this.getAllState();
            }
            // console.log("DATALIST", this.dataList);
          }  else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }else {
            // alert(res.message + " : " + res.result);
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result, type: false },
            });
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


  zipCodeFilter(eve) {
    console.log("ZipCode", eve);

    this.searchText = eve;
  }

  search(){
    return new Promise<void>((resolve, reject) => {
      let from;
      let to;
      let search;
      if (this.fromDate === undefined){
        from = "null"
    }
    else{
      from = this.fromDate;
    }
      if (this.toDate === undefined){
          to = "null"
      }
      else{
        to = this.toDate;
      }
      if (this.searchWord === undefined || this.searchWord === null || this.searchWord === ""){
        search = "null"
      }
      else{
        search = this.searchWord
      }
      let formObj = {
        searchword: search,
        from: from,
        to: to
      }
      if (search === "null" && from === "null" && to === "null"){
        this.getAllSchools();
      }
      else{
        const config = () => {
          let token = localStorage.getItem("BBToken");
          if (token != ""){
          return {Authorization: `Bearer ${token}`}
          }
        }
      this.http
        .post(
          this.uri + "bully-buddy/school/search_school" + "?searchword=" + search + "&from=" + from + "&to=" + to + "&schoolId=" + this.userInfo.schoolid, "", {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            // this.userData = res.result;
            this.totalRecords = res.result.length

            console.log("Report", res.result);
           }
           if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }
           if (this.totalRecords === 0){
            this.showNoRecord = true;
          }
          else{
            this.showNoRecord = false
          }

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

schoolSearch(eve){
  const arrLen: any = [];
    this.searchText = eve;
    let searchWord = eve;
    let to;
    let from;

    if (this.toDate === undefined){
        to = "null"
    }
    else{
      to = this.toDate;
    }
    if (this.fromDate === undefined){
      from = "null"
  }
  else{
    from = this.fromDate;
  }
    //  console.log("searchWord",this.searchWord);
    if (this.searchWord === "" || this.searchWord === undefined){
      this.searchText = eve;
    }
    else{
      this.searchText = this.searchWord;
    }
    // console.log("search Text",this.searchText)
    if (this.searchText === "") {
      // alert("hi");
      this.getAllSchools();
    }
     if (this.searchText !== undefined)
    {
    if (this.searchText !== "" && this.searchText.length > 1) {
      const config = () => {
        let token = localStorage.getItem("BBToken");
        if (token != ""){
        return {Authorization: `Bearer ${token}`}
        }
      }
      this.http
        .post(
          this.uri +
            "bully-buddy/school/search_school" + "?searchword=" + searchWord + "&from=" + from + "&to=" + to + "&schoolId=" + this.userInfo.schoolid, "", {headers: config()}
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            // console.log("searchUser", res.result);
            arrLen.push(res.result);
            this.dataList = res.result;
            this.totalRecords = res.result.length;
          }
          if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }
          if (this.totalRecords === 0){
            this.showNoRecord = true;
          }
          else{
            this.showNoRecord = false
          }
        },error => {
          console.log('oops', error);
          if (error.status === 504){
          alert("You have been logout");
            this.router.navigateByUrl("/login");
          }
        });
    }
  }
}

  stateFilter(eve) {
    // console.log("STAE", eve);
  if (eve !== ""){
  //  let formObj = {
  //     zipCode: "",
  //   };
  let formObj = new FormData();
  formObj.append('zipCode','')
    const config = () => {
      let token = localStorage.getItem("BBToken");
      if (token != ""){
      return {Authorization: `Bearer ${token}`}
      }
    }
     return new Promise<void>((resolve, reject) => {
      this.http
        .post(
          this.uri +
            "bully-buddy/school/get_school_by_statename_zipcode" +
            "?statename=" + eve, formObj, {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
             this.totalRecords = res.result.length;
            // console.log("SChpols", this.dataList);
            // if (this.schoolList.length === 1) {
            //   this.editSchoolId = this.schoolList[0].id;
            // }
             if (this.totalRecords === 0) {
              this.showNoRecord = true;
            }
            else{
              this.showNoRecord = false;
            }
          } else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }else {
            // alert(res.message + " : " + res.result);
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result, type: false },
            });
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
    this.searchText = eve;
  }
  else{
    this.page = 1;
    this.getAllSchools();
  }

  }
  getAllState() {
    // let formObj = {
    //   schoolId: this.userInfo.schoolid,
    // };
    const config = () => {
      let token = localStorage.getItem("BBToken");
      if (token != ""){
      return {Authorization: `Bearer ${token}`}
      }
    }
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/state/get_all_state", '', {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.stateItems = res.result;
            this.stateList = JSON.stringify(res.result);
            localStorage.setItem("States", this.stateList);
            // console.log("STATE,", this.stateList);
          } else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }
          else {
            // alert(res.message + " : " + res.result);
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result, type: false },
            });
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



  showClear(eve){
    if (eve !== ""){
        this.visibleClear = true;
    }
    else{
      this.visibleClear = false;
      this.getAllSchools();
    }

  }

clearResult(){
  // alert("HIT");
  this.visibleClear = false;
  this.searchText = "";
  this.searchWord = "";
  this.getAllSchools();
}



  excelUpload() {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      // height: "100%",
      data: {
        title: "Upload School Excel",
        divType: "UploadExcel",
        fileName: "school",
      },
    });
  }
  addSchool() {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: { title: "Add School", divType: "addSchool" },
    });
  }
  editSchool(list) {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Edit School",
        divType: "editSchool",
        school_name: list.schoolName,
        school_id: list.id,
        school_address: list.schoolAddress,
        school_state: list.stateId,
        zipCode: list.zipCode,
        isBoarding: list.isBoarding,
        school_city: list.city,
        createdDateTime: list.createdDateTime
      },
    });
  }

  deleteSchool(id) {
    var confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: "20%",
      data: {
        title: "Delete School",
        message: "Are you want to delete this school?",
      },
    });
    confirmResult.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // let formObj = new FormData();
        // formObj.append("id", id);
        let formObj = {
          id: id,
        };
        const config = () => {
          let token = localStorage.getItem("BBToken");
          if (token != ""){
          return {Authorization: `Bearer ${token}`}
          }
        }
        this.http
          .post(this.uri + "bully-buddy/school/delete_school", formObj,{headers: config()})
          .subscribe((res: any) => {
            if (res.status == "200") {
              this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School Deleted", type: true },
          });
              // console.log("SeatchSchooltext",this.searchText);
              if (this.searchText === " " || this.searchText === undefined){
                // alert("hi");
              this.getAllSchools();
              }
              else{
                this.schoolSearch(this.searchText);
              }
            }
            else if (res.status === "504" || res.status === 504){
              this.alertDialog.open(SuccessComponent, {
                width: "30%",
                data: { value: res.message + " : " + res.result + "You have been logout", type: false },
              });
              this.router.navigateByUrl("/login");
            }else{
                 this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School Delete Failed", type: false },
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
  excelDownload() {
    let from = "null";
    let to = "null";
    let state = "null";
    let stateList: any;
    stateList = localStorage.getItem("States")
    // if(this.fromDate !== undefined && this.fromDate !== null){
    //   from = this.fromDate
    // }
    // if(this.toDate !== undefined && this.toDate !== null){
    //   to = this.toDate
    // }
    // console.log("STATELI",stateList)
    if (this.selectedState !== null && this.selectedState !== ""){
      for (let i = 0; i < this.stateItems.length; i++){
        if (this.stateItems[i].statename == this.selectedState){
          state = this.stateItems[i].id;
          state = state.toString();
        }
      }
      
      console.log("STATEID", state);
      const config = () => {
        let token = localStorage.getItem("BBToken");
        if (token != ""){
        return {Authorization: `Bearer ${token}`}
        }
      }
    const url = this.uri + "bully-buddy/excel/download_school" + "?from=" + from + "&to=" + to + "&stateId=" + state;
    this.http.post(url, '', { headers: config(),responseType: "blob" }).subscribe((data) => {
      console.log("BLOB", data);
      const blob = new Blob([data], {
        type: "application/vnd.ms.excel",
      });
      const file = new File([blob], "school" + ".xlsx", {
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
  else{
    this.alertDialog.open(SuccessComponent, {
      width: "30%",
      data: { value: "Please Select a state to Export Excel!", type: false },
    });
    this.router.navigateByUrl("/login");
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
  doLogOut() {
    localStorage.removeItem("SuperAdmin");
    localStorage.removeItem("UserInfo");
    this.router.navigateByUrl("/login");
  }
}
