import { BereavementComponent } from "./bereavement/bereavement.component";
import { ForgotPasswordScreenComponent } from "./forgot-password-screen/forgot-password-screen.component";
import { TemplatesComponent } from "./templates/templates.component";
import { SchoolsComponent } from "./schools/schools.component";
import { UserTypesComponent } from "./user-types/user-types.component";
import { StatesComponent } from "./states/states.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { LoginComponent } from "./views/login/login.component";
// import { RegisterComponent } from "./views/register/register.component";
import { SubCategoryComponent } from "./sub-category/sub-category.component";
import { ServicesComponent } from "./services/services.component";
import { SubServiceComponent } from "./sub-service/sub-service.component";
import { VendorsComponent } from "./vendors/vendors.component";
import { DashboardComponent } from "./views/dashboard/dashboard.component";
// import { FaqComponent } from "./faq/faq.component";
// import { ReportsComponent } from "./reports/reports.component";
// import { BannersComponent } from "./banners/banners.component";
// import { CustomersComponent } from "./customers/customers.component";
// import { OrdersComponent } from "./orders/orders.component";
import { ActiveVendorsComponent } from "./active-vendors/active-vendors.component";
// import { PromocodeComponent } from "./promocode/promocode.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { EmergencyReportComponent } from "./emergency-report/emergency-report.component";
import { ApproveSchoolComponent } from "./approve-school/approve-school.component";
import { RoomlistComponent } from "./chats/roomlist.component";
import { SettingsComponent } from "./settings/settings.component";
export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404",
    },
  },
  {
    path: "500",
    component: P500Component,
    data: {
      title: "Page 500",
    },
  },
  {
    path: "login",
    component: LoginComponent,
    data: {
      title: "Login Page",
    },
  },
  {
    path: "resetpassword",
    component: ForgotPasswordScreenComponent,
    data: {
      title: "Password Reset Page",
    },
  },
  // {
  //   path: "register",
  //   component: RegisterComponent,
  //   data: {
  //     title: "Register Page",
  //   },
  // },
  {
    path: "dash",
    component: DefaultLayoutComponent,
    data: {
      title: "Home",
    },
    children: [
      {
        path: "",
        redirectTo: "school",
        pathMatch: "full",
      },
      // {
      //   path: "category",
      //   loadChildren: () =>
      //     import("./views/dashboard/dashboard.module").then(
      //       (m) => m.DashboardModule
      //     ),
      // },
      {
        path: "school",
        component: SchoolsComponent,
      },
      {
        path: "approveschool",
        component: ApproveSchoolComponent,
      },
      {
        path: "users",
        component: SubCategoryComponent,
      },
      {
        path: "admin",
        component: ServicesComponent,
      },
      {
        path: "incidents",
        component: SubServiceComponent,
      },
      {
        path: "teachers",
        component: HomePageComponent,
      },
      {
        path: "emergencyreport",
        component: EmergencyReportComponent,
      },
      {
        path: "state",
        component: StatesComponent,
      },
      {
        path: "usertype",
        component: UserTypesComponent,
      },
      // {
      //   path: "vendors",
      //   component: VendorsComponent,
      // },
      {
        path: "busroute",
        component: ActiveVendorsComponent,
      },
      {
        path: "bereavement",
        component: BereavementComponent,
      },
      {
        path: "template",
        component: TemplatesComponent,
      },

      {
        path: "settings",
        component: SettingsComponent,
      },
      {
        path: "roomlist",
        component: RoomlistComponent,
      }
      // {
      //   path: "customers",
      //   component: CustomersComponent,
      // },
      // {
      //   path: "orders",
      //   component: OrdersComponent,
      // },
      // {
      //   path: "reports",
      //   component: ReportsComponent,
      // },
      // {
      //   path: "promocode",
      //   component: PromocodeComponent,
      // },
      // {
      //   path: "faq",
      //   component: FaqComponent,
      // },
      // {
      //   path: "base",
      //   loadChildren: () =>
      //     import("./views/base/base.module").then((m) => m.BaseModule),
      // },
      // {
      //   path: "buttons",
      //   loadChildren: () =>
      //     import("./views/buttons/buttons.module").then((m) => m.ButtonsModule),
      // },
      // {
      //   path: "charts",
      //   loadChildren: () =>
      //     import("./views/chartjs/chartjs.module").then((m) => m.ChartJSModule),
      // },
      // {
      //   path: "dashboard",
      //   loadChildren: () =>
      //     import("./views/dashboard/dashboard.module").then(
      //       (m) => m.DashboardModule
      //     ),
      // },
      // {
      //   path: "icons",
      //   loadChildren: () =>
      //     import("./views/icons/icons.module").then((m) => m.IconsModule),
      // },
      // {
      //   path: "notifications",
      //   loadChildren: () =>
      //     import("./views/notifications/notifications.module").then(
      //       (m) => m.NotificationsModule
      //     ),
      // },
      // {
      //   path: "theme",
      //   loadChildren: () =>
      //     import("./views/theme/theme.module").then((m) => m.ThemeModule),
      // },
      // {
      //   path: "widgets",
      //   loadChildren: () =>
      //     import("./views/widgets/widgets.module").then((m) => m.WidgetsModule),
      // },
      
    ],
  },
  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
