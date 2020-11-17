import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import * as moment from "moment";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
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

  fileUrl = this.property.fileUrl;
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
  url = this.property.uri;
  getCookies: string = this.cookieService.get("LoginStatus");
  // pagedItems: Array<any>;
  ngOnInit() {
    console.log("cookie", this.getCookies);
    if (this.getCookies === "") {
      console.log("NAVIGATE");
      localStorage.removeItem("userInfo");
      // this.router.navigateByUrl("/login");
      window.location.href = "http://3.128.136.18/admin/#/login";
    }
    if (this.schoolId === null || this.schoolId === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      // this.router.navigateByUrl("/login");
      window.location.href = "http://3.128.136.18/admin/#/login";
    } else if (this.schoolId !== null) {
      this.getAllIncedents();
    }
    // if (this.schoolId.schoolid === 0) {
    //   this.isSuperAdmin = true;

    // } else {
    //   this.getIncidentsById();
    // }
  }
  // beginPagination(pagedItems: Array<any>) {
  //   this.pagedItems = pagedItems;
  // }
  getAllIncedents() {
    let arrLen: any = [];
    return new Promise((resolve, reject) => {
      let formObj = {
        schoolId: this.schoolId.schoolid,
      };
      this.http
        .post(this.url + "bully-buddy/incident/get_all_incident", formObj)
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            // console.log("INCEdents", this.dataList);
            arrLen.push(res.result);
            // if (arrLen[0].length === 1) {
            //   this.dataList = [];
            //   this.dataList.push(res.result);
            // } else {
            this.dataList = res.result;
            this.data = res.result;
            this.totalRecords = res.result.length;
            if (this.totalRecords === 0) {
              this.showNoRecord = true;
            }
            // console.log("INCITOTAL", this.totalRecords);
            // }
          } else {
            this.showNoRecord = true;
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
    return new Promise((resolve, reject) => {
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
  dayFilter(eve) {
    let arrayList = [];
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
      this.searchText = "";
      this.dataList = this.data;
      // let arrayList = [];
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
      // console.log("Today", date.toString());
    }
    if (eve === "3: Weekly") {
      this.searchText = "";

      const from_date = today.startOf("isoWeek").format("YYYY-MM-DD");
      const to_date = today.endOf("isoWeek").format("YYYY-MM-DD ");

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

      this.dataList = arrayList;
      this.searchText = "";
      this.totalRecords = this.dataList.length;
    }
    if (eve === "4: Monthly") {
      this.searchText = "";
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
      // console.log("Search", this.searchText);
    }
    if (eve === "5: Yearly") {
      this.searchText = "";

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
  }

  excelDownload() {
    let url = "http://3.128.136.18:5001/api/excel/download_incident";
    this.http.get(url, { responseType: "blob" }).subscribe((data) => {
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

fileOpen(list) {
    let fileURl;
    let file = list;
     let type;
    // let type = list.substr(list.indexOf(".") + 1, list.length);

    if(file!="url"||file!=undefined||file!=null){
    type = list.substr(list.length - 3);
    file = file.toString();
    console.log("TYPE", type);
    if (file.includes("uploads")) {
      fileURl = this.fileUrl + list;
    } else {
      fileURl = list;
    }
    }
    else{
      type="NoFile"
    }

    console.log("fileURl", fileURl);
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Incident Attachment",
        divType: "openFile",
        fileURL: fileURl,
        type: type,
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
}
