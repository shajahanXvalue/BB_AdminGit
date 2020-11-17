// import { CookieService } from "angular2-cookie/core";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { SuccessComponent } from '../success/success.component';

@Component({
  selector: "app-services",
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.css"],
})
export class ServicesComponent implements OnInit {
  //Pagination
  data: Array<any>;
  totalRecords: Number;
  page: Number = 1;
  //Search
  searchText: any;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public alertDialog: MatDialog,
    private property: PropertyServiceService,
    private router: Router,
    private cookieService: CookieService
  ) {
    //Pagination
    this.data = new Array<any>();

    dialog.afterAllClosed.subscribe(() => {
      this.ngOnInit();
      // if (this.userInfo.schoolid === 0) {
      // this.isSuperAdmin = true;
      //   this.getAllAdmin();
      // } else {
      //   this.getAdmin();
      // }
    });
  }
  isSuperAdmin: boolean = false;
  userInfo = JSON.parse(localStorage.getItem("UserInfo"));
  adminList: any = [];
  dataList: any;
  orderAdminFlag: boolean = false;
  url = this.property.uri;
  getCookies: string = this.cookieService.get("LoginStatus");
  ngOnInit() {
    if (this.getCookies !== "login") {
      localStorage.removeItem("userInfo");
      // this.router.navigateByUrl("/login");
      window.location.href = "http://3.128.136.18/admin/#/login";
    }
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      // this.router.navigateByUrl("/login");
      window.location.href = "http://3.128.136.18/admin/#/login";
    }
    if (this.userInfo.schoolid === 0) {
      this.isSuperAdmin = true;
      this.getAllAdmin();
    } else {
      this.getAdmin();
    }
  }

  getAllAdmin() {
    let arrLen: any = [];
    this.http.get(this.url + "bully-buddy/admin/list").subscribe((res: any) => {
      if (res.status == "200") {
        // console.log("RESSSSS", res);
        arrLen.push(res.result);
        // console.log("RESsss", arrLen[0].length);
        if (arrLen[0].length === 1) {
          this.adminList = [];
          this.adminList.push(res.result);
          this.data = res.result;
          this.totalRecords = res.result.length;
        } else {
          this.adminList = res.result;
          this.data = res.result;
          this.totalRecords = res.result.length;
        }
      }
    });
  }

  getAdmin() {
    let formObj = {
      id: this.userInfo.id,
    };
    let arrLen: any = [];
    this.http
      .post(this.url + "bully-buddy/admin/get_admin_by_id", formObj)
      .subscribe((res: any) => {
        if (res.status == "200") {
          // arrLen = [];
          arrLen.push(res.result);
          // console.log("RESsss", arrLen);
          if (arrLen.length === 1) {
            this.adminList = [];
            this.adminList.push(res.result);
            this.data = res.result;
            this.totalRecords = res.result.length;
          } else {
            this.adminList = res.result;
            this.data = res.result;
            this.totalRecords = res.result.length;
          }
        }
        console.log("ADMINLENGTH", this.totalRecords);
      });
  }
  addAdmin() {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: { title: "Add Admin", divType: "addAdmin" },
    });
  }
  editAdmin(list) {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Edit Admin",
        divType: "editAdmin",
        admin_id: list.id,
        admin_school_id: list.schoolid,
        admin_username: list.username,
        admin_password: list.password,
      },
    });
  }
  deleteAdmin(id) {
    var confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: "20%",
      data: {
        title: "Delete Admin",
        message: "Are you want to delete this Admin!",
      },
    });
    confirmResult.afterClosed().subscribe((result: boolean) => {
      if (result) {
        let formObj = {
          id: id,
        };
        this.http
          .post(this.url + "bully-buddy/admin/delete_admin", formObj)
          .subscribe((res: any) => {
            if (res.status == "200") {
               this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Admin Deleted", type: true },
          });
              if (this.userInfo.schoolid === 0) {
                // this.isSuperAdmin = true;
                this.getAllAdmin();
              } else {
                this.getAdmin();
              }
            }
            else{
               this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Admin Deleted Failed", type: false },
          });
            }
          });
      }
    });
  }
  orderAdmin() {
    if (!this.orderAdminFlag) {
      this.adminList.sort((a, b) => {
        return b.id - a.id;
      });
    } else {
      this.adminList.sort((a, b) => {
        return a.id - b.id;
      });
    }
    this.orderAdminFlag = !this.orderAdminFlag;
  }
}
