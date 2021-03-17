import { WindowService } from "./forgot-password-screen/window.service";
import { NgxPaginationModule } from "ngx-pagination";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgSelectModule } from "@ng-select/ng-select";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// import { HttpModule } from "@angular/http";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { CookieModule } from "ngx-cookie";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};
import { OrderModule } from 'ngx-order-pipe';
import { AppComponent } from "./app.component";
import { NgxDropzoneModule } from "ngx-dropzone";
// Import containers
import { DefaultLayoutComponent } from "./containers";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { LoginComponent } from "./views/login/login.component";
// import { RegisterComponent } from "./views/register/register.component";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { JwPaginationComponent } from "jw-angular-pagination";

const APP_CONTAINERS = [DefaultLayoutComponent];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from "@coreui/angular";

// Import routing module
import { AppRoutingModule } from "./app.routing";

// Import 3rd party components
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ChartsModule } from "ng2-charts";
import { HomePageComponent } from "./home-page/home-page.component";
import { DialogModalComponent } from "./dialog-modal/dialog-modal.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SubCategoryComponent } from "./sub-category/sub-category.component";
import { ServicesComponent } from "./services/services.component";
import { SubServiceComponent } from "./sub-service/sub-service.component";
import { VendorsComponent } from "./vendors/vendors.component";
import { DeleteDialogComponent } from "./delete-dialog/delete-dialog.component";
// import { FaqComponent } from "./faq/faq.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { SuccessComponent } from "./success/success.component";
// import { ReportsComponent } from "./reports/reports.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { PropertyServiceService } from "./property-service.service";
import { jqxTabsModule } from "jqwidgets-ng/jqxtabs";
import { SelectDropDownModule } from "ngx-select-dropdown";
// import { BannersComponent } from "./banners/banners.component";
// import { CustomersComponent } from "./customers/customers.component";
// import { OrdersComponent } from "./orders/orders.component";
import { ActiveVendorsComponent } from "./active-vendors/active-vendors.component";
// import { PromocodeComponent } from "./promocode/promocode.component";
import { DashboardComponent } from "./views/dashboard/dashboard.component";
import { EmergencyReportComponent } from "./emergency-report/emergency-report.component";
import { StatesComponent } from "./states/states.component";
import { UserTypesComponent } from "./user-types/user-types.component";
import { SchoolsComponent } from "./schools/schools.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { DropdownListModule } from "ngx-dropdown-list";
// import { CookieService } from "ngx-cookie-service";
import { CookieService } from "angular2-cookie/services/cookies.service";
// import { SelectDropDownModule } from "ngx-select-dropdown";
import { DatePipe } from "@angular/common";
import { TemplatesComponent } from "./templates/templates.component";
import { ForgotPasswordScreenComponent } from "./forgot-password-screen/forgot-password-screen.component";
import { BereavementComponent } from "./bereavement/bereavement.component";
import { ApproveSchoolComponent } from "./approve-school/approve-school.component";
import { RoomlistComponent } from "./chats/roomlist.component";
import { ChatService } from "./chats/chat.service";
import { Ng2AlphabetSortModule } from 'ng2-alphabet-sort';
import {DpDatePickerModule} from 'ng2-date-picker';
// import { NgDatepickerModule } from 'ng2-datepicker';
import { MyDatePickerModule } from 'mydatepicker';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { SettingsComponent } from './settings/settings.component';

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'left',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  imports: [
    jqxTabsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HttpClientModule,
    CookieModule.forRoot(),
    // HttpParams,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatNativeDateModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    DropdownListModule,
    NgSelectModule,
    SelectDropDownModule,
    // SelectDropDownModule,
    // NgModule,
    OrderModule,
    DpDatePickerModule,
    // NgDatepickerModule,
    MyDatePickerModule,
    AngularMyDatePickerModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    // RegisterComponent,
    HomePageComponent,
    DialogModalComponent,
    SubCategoryComponent,
    ServicesComponent,
    SubServiceComponent,
    VendorsComponent,
    DeleteDialogComponent,
    JwPaginationComponent,
    // FaqComponent,
    SuccessComponent,
    // ReportsComponent,
    // BannersComponent,
    // CustomersComponent,
    // OrdersComponent,
    ActiveVendorsComponent,
    // PromocodeComponent,
    EmergencyReportComponent,
    StatesComponent,
    UserTypesComponent,
    SchoolsComponent,
    TemplatesComponent,
    ForgotPasswordScreenComponent,
    BereavementComponent,
    ApproveSchoolComponent,
    RoomlistComponent,
    SettingsComponent,
    DashboardComponent,
    // DefaultLayoutComponent
  ],
  providers: [
    CookieService,
    WindowService,
    DatePipe,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    PropertyServiceService,
    ChatService,
  ],
  entryComponents: [
    DialogModalComponent,
    DeleteDialogComponent,
    SuccessComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
