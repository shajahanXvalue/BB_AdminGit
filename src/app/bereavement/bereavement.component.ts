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

@Component({
  selector: 'app-bereavement',
  templateUrl: './bereavement.component.html',
  styleUrls: ['./bereavement.component.css']
})
export class BereavementComponent implements OnInit {

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
  constructor( private http: HttpClient,
    public dialog: MatDialog,
    private property: PropertyServiceService,
    private router: Router,
    private datePipe: DatePipe,
    private cookieService: CookieService)
    {
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
  schoolName: any = [];
  getCookies: string = this.cookieService.get("LoginStatus");

  ngOnInit(): void {
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
    this.getAllBereavement();
    // } else {
    //   this.getReportById();
    // }
  }

   getAllBereavement() {
    // let formObj = {
    //   schoolId: this.userInfo.schoolid,
    // };
    return new Promise((resolve, reject) => {
      this.http
        .get(
          this.uri + "bully-buddy/bereavement/get_all_bereavement")
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            this.data = res.result;
            console.log("Report", this.dataList);
            this.totalRecords = res.result.length;

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
    let fileURL=this.property.fileUrl2
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
      fileURl = list;
    }
  }
  else{
      type="NoFile"
    }
    }else{
      type="NoFile"
    }
console.log("TYPE", type);
    console.log("fileURl", fileURl);
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Bereavement Attachment",
        divType: "openFile",
        fileURL: fileURl,
        type: type,
      },
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
