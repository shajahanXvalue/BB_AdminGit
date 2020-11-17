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
import * as moment from "moment";
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

  // url = this.property.url;
  fileUrl = this.property.fileUrl;
  uri = this.property.uri;
  dataList: any = [];
  schoolList: any = [];
  totalSchool: any;
  showSuperAdmin: boolean = false;
  orderFlag: boolean = false;
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
      window.location.href="http://3.128.136.18/admin/#/login";
    }
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      // this.router.navigateByUrl("/login");
      // window.location.href = "/login";
      window.location.href="http://3.128.136.18/admin/#/login";
    }
    // if (this.userInfo.schoolid === 0) {
    //   this.showSuperAdmin = true;
    this.getAllReport();
    // } else {
    //   this.getReportById();
    // }
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

  getAllReport() {
    let formObj = {
      schoolId: this.userInfo.schoolid,
    };
    return new Promise((resolve, reject) => {
      this.http
        .post(
          this.uri + "bully-buddy/emergencyreport/get_all_emergencyreport",
          formObj
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            this.data = res.result;
            console.log("Report", this.dataList);
            this.totalRecords = res.result.length;
            if(this.totalRecords === 0 || this.totalRecords === undefined){
              this.showNoRecord = true;
            }else
            {
              this.showNoRecord = false;
            }
            this.getAllSchools();
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
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
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
    console.log("File",file);
    if(file!==""||file!==undefined||file!==null){
    type = list.substr(list.length - 3);
    file = file.toString();
    console.log("TYPE", type);
    if (file.includes("uploads")) {
      fileURl = this.fileUrl + list;
    } else {
      fileURl = list;
    }
    }else{
      type="NoFile"
    }

    console.log("fileURl", fileURl);
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

  dayFilter(eve) {
    var today = moment();
    // const from_date = today.startOf("week");
    // const to_date = today.endOf("week");
    console.log("EVEnt", eve);
    if (eve === "1: All") {
      this.searchText = "";
      this.dataList = this.data;
      this.totalRecords = this.dataList.length;
    }
    if (eve === "2: Daily") {
      let arrayList = [];
      this.dataList = this.data;
      let date = moment(today).format("YYYY-MM-DD");
      for (let j = 0; j < this.dataList.length; j++) {
        if (this.dataList[j].modifiedDateTime !== undefined) {
          var modifiedDateTime = moment(
            this.dataList[j].modifiedDateTime
          ).format("YYYY-MM-DD");
          var DateTime = modifiedDateTime.toString();
        }

        if (DateTime === date) {
          arrayList.push(this.dataList[j]);
        }
      }
      this.totalRecords = arrayList.length;
      this.searchText = date.toString();
      console.log("Today", date.toString());
    }
    if (eve === "3: Weekly") {
      const from_date = today.startOf("isoWeek").format("YYYY-MM-DD");
      const to_date = today.endOf("isoWeek").format("YYYY-MM-DD ");
      let arrayList = [];
      for (let i = 0; i < 7; i++) {
        var new_date = moment(from_date, "YYYY-MM-DD")
          .add(i, "days")
          .format("YYYY-MM-DD");
        new_date = new_date.toString();

        for (let j = 0; j < this.dataList.length; j++) {
          if (this.dataList[j].modifiedDateTime !== undefined) {
            var modifiedDateTime = moment(
              this.dataList[j].modifiedDateTime
            ).format("YYYY-MM-DD");
            var DateTime = modifiedDateTime.toString();
          }

          if (DateTime === new_date) {
            arrayList.push(this.dataList[j]);
          }
        }
      }
      // console.log("DATA", arrayList);
      this.dataList = arrayList;
      this.searchText = "";
      this.totalRecords = this.dataList.length;
      // console.log("example", this.dataList);
    }
    if (eve === "4: Monthly") {
      let arrayList = [];
      this.dataList = this.data;
      const from_date = today.startOf("month").format("YYYY-MM");
      for (let j = 0; j < this.dataList.length; j++) {
        if (this.dataList[j].modifiedDateTime !== undefined) {
          var modifiedDateTime = moment(
            this.dataList[j].modifiedDateTime
          ).format("YYYY-MM");
          var DateTime = modifiedDateTime.toString();
        }

        if (DateTime === new_date) {
          arrayList.push(this.dataList[j]);
        }
      }
      this.totalRecords = this.dataList.length;
      this.searchText = from_date.toString();
      console.log("Search", this.searchText);
    }
    if (eve === "5: Yearly") {
      let arrayList = [];
      this.dataList = this.data;
      const from_date = today.startOf("year").format("YYYY");
      for (let j = 0; j < this.dataList.length; j++) {
        if (this.dataList[j].modifiedDateTime !== undefined) {
          var modifiedDateTime = moment(
            this.dataList[j].modifiedDateTime
          ).format("YYYY");
          var DateTime = modifiedDateTime.toString();
        }

        if (DateTime === new_date) {
          arrayList.push(this.dataList[j]);
        }
      }
      this.totalRecords = this.dataList.length;
      this.searchText = from_date.toString();
      console.log("Search", this.searchText);
    }

    // console.log("DATE", fromDate);
  }
  excelDownload() {
    let url = "http://3.128.136.18:5001/api/excel/download_emergencyreport";
    this.http.get(url, { responseType: "blob" }).subscribe((data) => {
      console.log("BLOB", data);
      const blob = new Blob([data], {
        type: "application/vnd.ms.excel",
      });
      const file = new File([blob], "emergencyreport" + ".xlsx", {
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
