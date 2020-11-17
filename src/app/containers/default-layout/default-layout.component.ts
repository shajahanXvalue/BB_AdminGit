import { Component } from "@angular/core";
import { navItems } from "../../_nav";
import { Router } from "@angular/router";
// import { CookieService } from "ngx-cookie-service";
// import { CookieService } from "ngx-cookie";
import { CookieService } from "angular2-cookie/core";
@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html",
})
export class DefaultLayoutComponent {

  userId = JSON.parse(localStorage.getItem("UserInfo"));
  public sidebarMinimized = false;
  public navItems = navItems;
  constructor(private router: Router, private _cookieService: CookieService) {}

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log("USER",this.userId.schoolid)
  }



  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  doLogOut() {
    this._cookieService.remove("LoginStatus");
    // this.cookieService.getAll();
    localStorage.removeItem("UserInfo");
    localStorage.removeItem("States");
    this.router.navigateByUrl("/login");
  }
}
