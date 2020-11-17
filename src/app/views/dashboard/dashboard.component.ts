import { Component, OnInit } from "@angular/core";
// import { Properties } from '../../properties';
import { LocationStrategy } from "@angular/common";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../../property-service.service";
import { Router } from "@angular/router";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token",
    Accept: "*/*",
  }),
};

// const url = 'http://server.com/index.php';

const headers = new HttpHeaders();
headers.set("Content-Type", "application/json; charset=utf-8");
// const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
// const headers = { "Content-Type": "application/x-www-form-urlencoded" };
// const body = { title: "Angular POST Request Example" };
@Component({
  // selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  //Pagination
  data: Array<any>;
  totalRecords: Number;
  page: Number = 1;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private property: PropertyServiceService,
    private location: LocationStrategy,
    private router: Router
  ) {
    //Pagination
    this.data = new Array<any>();

    let scope = this;
    dialog.afterAllClosed.subscribe(() => {
      if (this.userInfo.schoolid === 0) {
        this.getAllSchools();
      } else {
        this.getSchoolById();
      }
    });
  }

  userInfo = JSON.parse(localStorage.getItem("UserInfo"));

  // url = this.property.url;
  // uri: string = "https://54.215.34.67:5001/bully-buddy/school/get_all_school";
  uri = this.property.uri;
  dataList: any = [];
  imgList: any;
  structImgList: any;
  structCatList: any;
  showSuperAdmin: boolean = false;
  orderFlag: boolean = false;
  // imgPath = this.property.url;

  ngOnInit() {
    console.log(this.userInfo.id);
    this.preventBackButton();
    if (this.userInfo.schoolid === 0) {
      this.showSuperAdmin = true;
      this.getAllSchools();
    } else {
      this.getSchoolById();
    }

    if (this.userInfo === null || this.userInfo === undefined) {
      this.router.navigateByUrl("/login");
    }

    // let scope = this;
    // this.getCategories().then(function () {
    //   scope.getAllImages().then(function () {
    //     scope.formatList();
    //   });
    // });
    // return new Promise((resolve, reject) => {
    //   this.http
    //     .get("http://54.215.34.67:5001/bully-buddy/school/get_all_school")
    //     .subscribe((res: any) => {
    //       if (res.status == "200") {
    //         this.dataList = res.result;
    //         console.log("REsult", this.dataList);
    //       }
    //       resolve();
    //     });
    // });
  }
  preventBackButton() {
    history.pushState(null, null, location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }
  getAllSchools() {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/school/get_all_school", "")
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
  getSchoolById() {
    let arrLen: any = [];
    let formObj = {
      id: this.userInfo.schoolid,
    };
    return new Promise((resolve, reject) => {
      this.http
        .post(this.uri + "bully-buddy/school/get_school_by_id", formObj)
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
            console.log("DATALIST", this.dataList);
          } else {
            alert(res.message + " : " + res.result);
          }
          resolve();
        });
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
        school_state: list.schoolAddress,
      },
    });
  }

  deleteSchool(id) {
    var confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: "20%",
      data: {
        title: "Delete School",
        message: "Are you want to delete this school!",
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
          .post(this.uri + "bully-buddy/school/delete_school", formObj)
          .subscribe((res: any) => {
            if (res.status == "200") {
              this.getAllSchools();
            }
          });
      }
    });
  }
  // addCatImg(id) {
  //   this.dialog.open(DialogModalComponent, {
  //     width: "50%",
  //     data: { title: "Add Category Image", divType: "addCatImg", cat_id: id },
  //   });
  // }
  // editCatImg(imgId, id, url) {
  //   this.dialog.open(DialogModalComponent, {
  //     width: "50%",
  //     data: {
  //       title: "Edit Category Image",
  //       divType: "editCatImg",
  //       img_id: imgId,
  //       cat_id: id,
  //       imgPath: url,
  //     },
  //   });
  // }
  // getAllImages() {
  //   this.imgList = [];
  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .post(this.url + "admin/get_cat_img", "")
  //       .subscribe((resp: any) => {
  //         if (resp.status_code == "200") {
  //           this.imgList = resp.data.result;
  //         }
  //         resolve();
  //       });
  //   });
  // }
  // formatList() {
  //   this.structCatList = [];
  //   this.dataList.forEach((element) => {
  //     this.structImgList = [];
  //     var images = this.imgList.filter(function (list) {
  //       return list.cat_id === element.id;
  //     });
  //     this.structCatList.push({
  //       id: element.id,
  //       category: element.category,
  //       images: images,
  //     });
  //   });
  // }
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

  doLogOut() {
    localStorage.removeItem("SuperAdmin");
    localStorage.removeItem("UserInfo");
    this.router.navigateByUrl("/login");
  }
}
