import { Component, OnInit } from "@angular/core";
import { LocationStrategy } from "@angular/common";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-types",
  templateUrl: "./user-types.component.html",
  styleUrls: ["./user-types.component.css"],
})
export class UserTypesComponent implements OnInit {
  //Pagination
  data: Array<any>;
  totalRecords: Number;
  page: Number = 1;

  //Search
  searchText: any;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private property: PropertyServiceService,
    private router: Router
  ) {
    //Pagination
    this.data = new Array<any>();
  }

  userInfo = JSON.parse(localStorage.getItem("UserInfo"));

  // url = this.property.url;
  uri = this.property.uri;
  dataList: any = [];

  showSuperAdmin: boolean = false;
  orderFlag: boolean = false;

  ngOnInit() {
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      this.router.navigateByUrl("/login");
    }
    this.getAllUserTypes();
  }
  getAllUserTypes() {
    // let formObj = {
    //   schoolId: this.userInfo.schoolid,
    // };
    return new Promise((resolve, reject) => {
      this.http
        .get(this.uri + "bully-buddy/usertype/get_all_usertype")
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.dataList = res.result;
            this.data = res.result;
            this.totalRecords = res.result.length;
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
    });
  }

  excelDownload() {
    let url = "http://3.128.136.18:5001/api/excel/download_usertype";
    this.http.get(url, { responseType: "blob" }).subscribe((data) => {
      console.log("BLOB", data);
      const blob = new Blob([data], {
        type: "application/vnd.ms.excel",
      });
      const file = new File([blob], "usertype" + ".xlsx", {
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
