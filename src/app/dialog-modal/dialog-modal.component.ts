import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PropertyServiceService } from "../property-service.service";
import { SuccessComponent } from "../success/success.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { DatePipe } from "@angular/common";
import * as XLSX from "xlsx";
import { of, throwError } from "rxjs";
import { DriverProvider } from "protractor/built/driverProviders";
import { _countGroupLabelsBeforeOption } from "@angular/material/core";
// import { FileToUpload } from "./file-to-upload";
// import { FileUploadService } from "./file-upload.service";
// import { FileToUpload } from "./file-to-upload";
// var parser = require('simple-excel-to-json')

export interface DialogData {
  // imgPath: string;
  defaultImage:string;
  title: string;
  fileName: string;
  divType: string;
  school_name: string;
  school_address: string;
  school_state: string;
  school_ZipCode: string;
  school_id: any;
  school_city: any;
  isBoarding:any;
  admin_id: any;
  admin_school_id: any;
  admin_statename:any;
  admin_school_dist: any;
  admin_name: string;
  admin_userid:any;
  admin_username: string;
  admin_email: string;
  admin_password: string;
  admin_phone: string;
  admin_ccUser: string;
  //User fields
  email: any;
  schoolId: any;
  schoolId2:any;
  userSchoolName: any;
  userTypeId: any;
  name: any;
  userPhone: any;
  parentId: any;
  grade: any;
  parentPhone1: any;
  parentPhone2: any;
  driverPhone: any;
  schoolPhone: any;
  gender: any;
  address: any;
  zipCode: any;
  city: any;
  state: any;
  busRoute: any;
  password: any;
  createdDateTime:any;
  isSocialUser: any;
  socialMediaId: any;
  fbCyber: any;
  instaCyber: any;
  snapShotCyber: any;
  userid:any;
  ccUser:any;
  profileImage:any;
  //incident
  id: any;
  age: any;
  studentage:any;
  userId: any;
  bullyName: any;
  incidentPlace: any;
  isBullyClassmate: any;
  bullyGender: any;
  noOfDaysBullied: any;
  bullyType: any;
  bullyDescription: any;
  videoURL: any;
  bullyStatus: any;
  userLang:any;
  //teachers table
  teacher_name: any;

  //Drivers table
  driver_id: any;

  //Report Form
  fileURL: any;
  // defaultImage: any;
  latitude: any;
  langitude: any;
  type: any;
  // sub_ser_id: any;

  //Bereavement
  stateName:any;
  story:any;
  school:any;
  schoolDistrict:any;
  //Excel Upload
}

@Component({
  selector: "app-dialog-modal",
  templateUrl: "./dialog-modal.component.html",
  styleUrls: ["./dialog-modal.component.css"],
})
export class DialogModalComponent implements OnInit {
  xlsToJson = [];
  excelValidationErrors = [];
  validationEmail:boolean= false;
  allSchoolList=[];
  schoolList = [];

  searchSchoolId:any;
  adminSchoolList = [];
  userTypeList = [];
  userTypeList2 = [];
  busRouteList = [];
  stateId: any;
  stateList: any;
  excel_file: any;
  fileName: string = "";
  fileSize: number = 0;
  fileType: string = "";
  tabledata: any;
  columnArray = [];
  title: string;
  divType: string;
  type: boolean;
  showSuccess: boolean;
  category_name1: string;
  isSuperAdmin: boolean = false;
  adminSchoolId: any;
  isSocialUser = "";
  selectedValue: any = [];
  selectedState: any;
  selectedSchool: any;
  selectedGenderValue: any;
  selectedCountryCode: any;
  selectedBullyGender: any;
  selectedBullyClass: any;
  selectedBullyStatus: any;
  showFields: boolean = false;
  repAddress: any;
  userTypeId: any;
  userIds: any;
  editSchoolId: any;
  // adminSchoolId:any;
  teacherSchool:any;
  schoolId: any;
  schoolId2:any;
  adminSchoolid=[];
  userInfo = JSON.parse(localStorage.getItem("UserInfo"));
  busRoute: any;
  parentId: any;
  fileUrl: any;
  defaultImage: any;
  fileformat: any;
  zipCodesrch: any;
  userEditBusRoute: any;
  editUserZipCode: any;
  createdDate:any;
  //variables for input validation
  validAState="";
  validccUser="";
  validEmail="";
  validPassword="";
  validUName="";
  validUAge="";
  validEditUAge="";
  validState="";
  validSchool=""
  validGender="";
  validGrade="";
  validUPhone="";
  validPPhone1="";
  validAdminId="";
  validAName="";
  validAUName="";
  validAUId:any;
  validAPassword="";
  validAPhone ="";
  validccAdmin ="";
  validSName="";
  validSAddress="";
  validSState="";
  validSZipCode="";
  validSCity="";
  validTSchool="";
  validTUName="";
  validTGrade="";
  validTPhone="";
  validTGender="";
  validTPassword="";
  validTAge="";
  validTEmail="";
  validBRoute="";
  validBDId="";
  validBDSchool="";
  validBoarding = "";
  validULang="";
  profile_Image = "";
  dropSchoolName:any;
  driverName:any;
  uniqueDriver:any;
  driverUniqueName2:[];
  driverUniqueName:any;
  editDriverDummy:any=[{"name":"Dummy Driver","id":0}];
  showNoDriver:boolean= false;
  driverId:any;
  editDriverId:any;
  bereavementId:any;
  showLoading:boolean =false;
  isBoarding = "No";
//  config = {
//             displayKey:"description", //if objects array passed which key to be displayed defaults to description
//             search:true, //true/false for the search functionlity defaults to false,
//             height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
//             placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
//             customComparator: ()=>{} ,// a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
//             limitTo: 0, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
//             moreText: 'more' ,// text to be displayed whenmore than one items are selected like Option 1 + 5 more
//             noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
//             searchPlaceholder:'Search' ,// label thats displayed in search input,
//             searchOnKey: 'name', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
//             }


  constructor(
    public dialogRef: MatDialogRef<DialogModalComponent>,
    private router: Router,
    private formBuilder: FormBuilder,
    public alertDialog: MatDialog,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
    private property: PropertyServiceService,

  ) {}

  editForm: FormGroup;
  saveForm: FormGroup;
  adminSaveForm: FormGroup;
  adminEditForm: FormGroup;
  saveUserForm: FormGroup;
  editUserForm: FormGroup;
  editIncident: FormGroup;
  saveTeacherForm: FormGroup;
  editTeacherForm: FormGroup;
  saveBusRouteForm: FormGroup;
  editBusRouteForm: FormGroup;
  saveReportForm: FormGroup;
  editReportForm: FormGroup;
  excelUploadForm: FormGroup;
  ebbFileForm: FormGroup;
  editBereavementForm: FormGroup;
  url = this.property.uri;

  ngOnInit() {
    // this.getAllSchools();
    this.getAllUserTypes();
    this.getAllBusRoute();

    this.stateList = localStorage.getItem("States");
    this.stateList = JSON.parse(this.stateList);

    // let stateArray:any;
    // stateArray= localStorage.getItem("States");
    // stateArray = JSON.parse(stateArray);

    // if (this.userInfo.schoolid === 0) {
    //   this.isSuperAdmin = true;

    // this.stateList = localStorage.getItem("States");
    // this.stateList = JSON.parse(this.stateList);

    // }else{
    //   this.isSuperAdmin = false;
    //  for(let i=0;i<stateArray.length;i++){
    //   if(this.userInfo.stateId === stateArray[i].id){
    //     this.stateList=stateArray[i];
    //     console.log("AdminState",this.stateList);
    //   }
    // }
    // }


    this.schoolList=[{'id':'','SchoolName':''}];
    this.selectedBullyStatus = this.data.bullyStatus;
    this.title = this.data.title;
    this.divType = this.data.divType;
    this.fileUrl = this.data.fileURL;
    this.defaultImage = this.data.defaultImage;
    this.fileformat = this.data.type;
    this.fileName = this.data.fileName;
    this.adminSchoolId = this.data.admin_school_id;
    this.createdDate = this.data.createdDateTime;
    this.bereavementId = this.data.id;
    this.editDriverId = this.data.id;
    this.isBoarding = this.data.isBoarding;
    this.validBoarding = this.data.isBoarding;
    console.log("this.validBoarding",this.validBoarding);
    console.log("this.data",this.data.createdDateTime);
    console.log("TYPe",this.fileformat);
    console.log("ADMinID",this.adminSchoolId)
    if(this.adminSchoolId !== ""&& this.adminSchoolId !== undefined){
      this.getSchoolById(this.adminSchoolId);
    }
    console.log("this.data.school",this.data.school);
    this.schoolId = this.data.school_id;
    this.schoolId2 = parseInt(this.data.school_id);
    console.log("SchoolId", this.schoolId);
    if(this.schoolId !==""&&this.schoolId !==undefined){
      this.getDriver(this.schoolId)
    }
    this.teacherSchool=this.data.school_id;
    if(this.teacherSchool !==""&&this.teacherSchool !==undefined){
      this.getSchoolById(this.teacherSchool)
    }
    console.log("teacherSchool",this.teacherSchool);
    this.parentId = this.data.parentId;
    // if (this.data.schoolId !== "") {
    this.userIds = this.data.userTypeId;
    this.editSchoolId = this.data.schoolId;
    if(this.editSchoolId !=="" && this.editSchoolId !== undefined){
      this.getSchoolById(this.editSchoolId)
    }
    this.userTypeId = this.data.userTypeId;
    this.userEditBusRoute = this.data.busRoute;
    this.editUserZipCode = this.data.zipCode;
    console.log("EDITSchool",this.data.schoolId);
    console.log("editUserZipCode",this.editUserZipCode)
    // this.userIds = this.data.userTypeId;
    // console.log("userIds", this.userEditBusRoute);
    this.selectedBullyClass = this.data.isBullyClassmate;
    this.selectedBullyGender = this.data.bullyGender;
    // console.log("BullyGender", this.selectedBullyGender);
    // Valid Form Fields
    this.validEmail = this.data.email;
    this.validUName = this.data.name;
    this.validEditUAge = this.data.age;
    this.validSchool = this.data.schoolId;
    this.validState = this.data.state;
    this.validGrade = this.data.grade;
    this.validGender = this.data.gender;
    this.validUPhone = this.data.userPhone;
    this.validPPhone1 = this.data.parentPhone1;
    this.validAdminId = this.data.admin_id;
    this.validAName = this.data.admin_username;
    this.validAPassword = this.data.admin_password;
    this.validAPhone = this.data.admin_phone;
    this.validAUName = this.data.admin_name;
    this.validccAdmin = this.data.admin_ccUser;
    this.validTUName = this.data.teacher_name;
    this.validTSchool = this.data.school_id;
    this.validTGrade = this.data.grade;
    this.validSName = this.data.school_name;
    this.validSAddress = this.data.school_address;
    this.validSState = this.data.school_state;
    this.validSZipCode = this.data.zipCode;
    this.validSCity = this.data.school_city;
    this.validBRoute = this.data.busRoute;
    this.validBDId = this.data.driver_id;
    this.validBDSchool = this.data.school_id;
    this.validccUser = this.data.ccUser;
    this.validAUId = this.data.admin_userid;
    this.validULang = this.data.userLang;
    this.profile_Image = this.data.profileImage;
    // end ///
    console.log("this.profile_Image",this.profile_Image);
    console.log("this.validULang",this.validULang);
    console.log("this.validAPhone",this.validAPhone);
    console.log("this.validccUser",this.validccUser);
    this.selectedValue = this.data.school_state;
    this.selectedState = this.data.state;
    this.selectedGenderValue = this.data.gender;
    this.repAddress = this.data.address;
    this.validState = this.userInfo.stateName;
    if(this.selectedState === null||this.selectedState===undefined)
    {this.selectedState = this.userInfo.stateName;}
    console.log("selectedValue", this.selectedState);
    if (this.userInfo.schoolid === 0) {
      this.isSuperAdmin = true;
      this.validAState = this.data.admin_statename;
      this.validState = this.userInfo.stateName;
      // console.log("SDF", this.isSuperAdmin);
    }else{
      this.schoolId = this.userInfo.schoolid;
      this.isSuperAdmin = false;
      this.getSchoolById(this.userInfo.schoolid)
      this.validAState = this.userInfo.stateName;
      // this.selectedState = this.userInfo.stateName;
      // this.getSchoolByStateZip();

      console.log("this.validAState",this.validAState);
      console.log("this.userInfo.stateName", this.userInfo.stateName);
    }

    if (
      // (this.data.zipCode !== "" ||
      //   this.data.zipCode !== undefined ||
      //   this.data.zipCode !== null) &&
      (this.data.state !== "" ||
        this.data.state !== undefined ||
        this.data.state !== null)
    ) {
      this.zipCodesrch = this.data.zipCode;
      this.getSchoolByStateZip();
    }
    this.editForm = this.formBuilder.group({
      school_name: [this.data.school_name],
      school_address: [this.data.school_address],
      school_state: [this.data.school_state],
      school_ZipCode: [this.data.zipCode],
      school_boarding: [this.data.isBoarding],
      school_city: [this.data.school_city],
    });

    this.saveForm = this.formBuilder.group({
      school_name: [""],
      school_address: [],
      school_id: [],
      school_state: [],
      school_ZipCode: [],
      school_boarding: [],
      school_city: [],
    });
    // this.ebbFileForm = this.formBuilder.group({});
    this.adminSaveForm = this.formBuilder.group({
      admin_school_id: [],
      admin_school_dist: [],
      admin_name: [""],
      admin_username: [],
      admin_email: [],
      admin_password: [],
      admin_zipCode:[],
      admin_phone:[]
    });

    this.adminEditForm = this.formBuilder.group({
      admin_school_id: [this.data.admin_school_id],
      admin_school_dist: [this.data.admin_school_dist],
      admin_phone:[this.data.admin_phone],
      admin_name: [this.data.admin_name],
      admin_username: [this.data.admin_username],
      admin_password: [this.data.admin_password],
      admin_id: [this.data.admin_id],
      admin_zipCode:[]
    });

    this.saveUserForm = this.formBuilder.group({
      email: [],
      schoolId: [],
      userTypeId: [],
      name: [],
      age:[],
      userPhone: [],
      parentId: [],
      password: [],
      grade: [],
      parentPhone1: [],
      parentPhone2: [],
      driverPhone: [],
      schoolPhone: [],
      gender: [],
      address: [],
      zipCode: [],
      city: [],
      state: [],
      busRoute: [],
      isSocialUser: [],
      socialMediaId: [],
      fbCyber: [],
      instaCyber: [],
      snapShotCyber: [],
      // gender: new FormControl('', Validators.required)
    });

    this.editUserForm = this.formBuilder.group({

      id: [this.data.userid],
      email: [this.data.email],
      schoolId: [this.data.schoolId],
      userTypeId: [this.data.userTypeId],
      name: [this.data.name],
      age:[this.data.age],
      userPhone: [this.data.userPhone],
      parentId: [this.data.parentId],
      grade: [this.data.grade],
      parentPhone1: [this.data.parentPhone1],
      parentPhone2: [this.data.parentPhone2],
      driverPhone: [this.data.driverPhone],
      schoolPhone: [this.data.schoolPhone],
      gender: [this.data.gender],
      address: [this.data.address],
      zipCode: [this.data.zipCode],
      city: [this.data.city],
      // state: [this.data.state],
      busRoute: [this.data.busRoute],
      // createdDateTime:[this.data.createdDateTime]
    });
    this.editIncident = this.formBuilder.group({
      id: [this.data.id],
      userId: [this.data.userId],
      name: [this.data.name],
      grade: [this.data.grade],
      schoolId: [this.data.schoolId],
      age: [this.data.age],
      gender: [this.data.gender],
      bullyName: [this.data.bullyName],
      incidentPlace: [this.data.incidentPlace],
      isBullyClassmate: [this.data.isBullyClassmate],
      bullyGender: [this.data.bullyGender],
      noOfDaysBullied: [this.data.noOfDaysBullied],
      bullyType: [this.data.bullyType],
      bullyDescription: [this.data.bullyDescription],
      videoURL: [this.data.videoURL],
      bullyStatus: [this.data.bullyStatus],
    });
    this.saveTeacherForm = this.formBuilder.group({
      teacher_name: [],
      teacher_email:[],
      teacher_password:[],
      teacher_age:[],
      teacher_Phone:[],
      teacher_gender:[],
      school_id: [],
      grade: [],
      teacher_zipCode:[]
    });

    this.excelUploadForm = this.formBuilder.group({
      excel_file: [],
    });

    this.editTeacherForm = this.formBuilder.group({
      id: [this.data.id],
      teacher_name: [this.data.teacher_name],
      school_id: [this.data.school_id],
      grade: [this.data.grade],
      teacher_email:[],
      teacher_password:[],
      teacher_age:[],
      teacher_Phone:[],
      teacher_gender:[],
      teacher_zipCode:[]
    });

    this.saveBusRouteForm = this.formBuilder.group({
      busRoute: [],
      driver_id: [],
      school_id: [],
      bus_zipCode:[]
    });

    this.editBusRouteForm = this.formBuilder.group({
      id: [this.data.id],
      busRoute: [this.data.busRoute],
      driver_id: [this.data.driver_id],
      school_id: [this.data.school_id],
      bus_zipCode:[]
    });

    this.saveReportForm = this.formBuilder.group({
      userId: [],
      school_id: [],
      fileURL: [],
      latitude: [],
      langitude: [],
    });

    this.editReportForm = this.formBuilder.group({
      id: [this.data.id],
      userId: [this.data.userId],
      school_id: [this.data.school_id],
      fileURL: [this.data.fileURL],
      latitude: [this.data.latitude],
      langitude: [this.data.langitude],
    });
    this.editBereavementForm = this.formBuilder.group({
      name: [this.data.name],
      school_address: [this.data.address],
      school: [this.data.school],
      school_id: [this.data.id],
      school_state: [this.data.school_state],
      story: [this.data.story],
      district:[this.data.schoolDistrict],
      // createdDateTime: list.createdDateTime
    })
  }

  close() {
    this.dialogRef
      .close
      // this.router.navigateByUrl('/admin')
      ();
  }
  stateDropDown(eve) {
    this.stateId = eve;
  }
  boardingDropDown(eve){
    this.isBoarding = eve;
    this.validBoarding = eve;
  }
  driverDropDown(eve){
    this.driverId = eve
  }
  userSchoolDropDown(eve) {
    this.schoolId = eve;
    this.editSchoolId = this.schoolId;
    this.validBDSchool = eve;
    this.validTSchool = eve;
    console.log("SelectSchool", this.schoolId);
    this.getDriver(this.schoolId)
    this.getAllBusRoute()
  }



getDriver(eve){
  let formObj;
  const config=()=>{
    let token=localStorage.getItem("BBToken");
    if(token!=""){
    return {Authorization:`Bearer ${token}`}
    }
  }
  if(eve !== undefined && eve !== null){
    formObj = {
      schoolId:eve
    };
  }
  else{
    formObj = {
      schoolId:this.schoolId
    };
  }
  if(this.schoolId !== null&&this.schoolId!==""){
    this.http
    .post(this.url + "bully-buddy/busroute/get_all_drivers_by_school_id", formObj,{headers: config()})
    .subscribe((res: any) => {
      if (res.status == "200") {
        console.log("DRivers",res)
        this.driverName=res.result;
        this.getAllBusRoute();
        // for(let i=0;i<this.uniqueDriver.length;i++){
        //   for(let j=0;j<this.driverName.length;j++){
        //     if(this.uniqueDriver[i].name===this.driverName[i].name){
        //       console.log("Unique List",this.driverName[i]);
        //     }
        //   }
        // }
        if(res.result.length === 1){
          this.driverId = res.result[0].id;
        }
      }
      else if (res.status === "504" || res.status === 504){
        this.alertDialog.open(SuccessComponent, {
          width: "30%",
          data: { value: res.message + " : " + res.result + "You have been logout", type: false },
        });
        this.router.navigateByUrl("/login");
      }
      else{

      }
      console.log("DriverId",this.driverId);
    },error => {
      console.log('oops', error);
      if (error.status === 504){
      alert("You have been logout");
        this.router.navigateByUrl("/login");
      }
    });
  }

}
  saveSchool() {
    let token = localStorage.getItem("BBToken");;
    let school_name = this.saveForm.get("school_name").value;
    let school_address = this.saveForm.get("school_address").value;
    let stateId = this.saveForm.get("school_state").value;
    let zipCode = this.saveForm.get("school_ZipCode").value;
    let city = this.saveForm.get("school_city").value;
    const config=()=>{
      token = localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    let formObj = new FormData();
    formObj.append('schoolName',school_name)
    formObj.append('schoolAddress',school_address)
    formObj.append('stateId',stateId)
    formObj.append('zipCode',zipCode)
    formObj.append('isBoarding',this.isBoarding)
    formObj.append('city',city)
      // schoolName: school_name,
      // schoolAddress: school_address,
      // stateId: stateId,
      // zipCode: zipCode,
      // isBoarding: this.isBoarding,
      // city: "LA"
    
  
    if ((school_name != "" && school_name != undefined) && (this.isBoarding !== "" && this.isBoarding !== undefined)) {
      this.http
        .post(this.url + "bully-buddy/school/add_school", formObj,{headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School Added Successfuly", type: true },
          });
          } else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School Adding Failed", type: false },
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
  }
  editSchool() {
    let school_name = this.editForm.get("school_name").value;
    let school_address = this.editForm.get("school_address").value;
    let zipCode = this.editForm.get("school_ZipCode").value;
    let city = this.saveForm.get("school_city").value;
    // let formData = {
    //   id: this.data.school_id,
    //   schoolName: school_name,
    //   schoolAddress: school_address,
    //   stateId: this.selectedValue,
    //   zipCode: zipCode,
    //   isBoarding: this.isBoarding,
    //   city: this.validSCity
    // };
    let formData = new FormData();
    formData.append('id',this.data.school_id)
    formData.append('schoolName',school_name)
    formData.append('schoolAddress',school_address)
    formData.append('stateId',this.selectedValue)
    formData.append('zipCode',zipCode)
    formData.append('isBoarding',this.isBoarding)
    formData.append('city',this.validSCity)
    
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    if ((school_name != "" && school_name != undefined) && (this.isBoarding !== "" && this.isBoarding !== undefined)) {
      this.http
        .post(this.url + "bully-buddy/school/update_school", formData,{headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School Update Successfuly", type: true },
          });
          } else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "School Update Failed", type: false },
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
  }

  saveAdmin() {
    this.validccUser = this.selectedCountryCode;
    let school_id = this.adminSaveForm.get("admin_school_id").value;
    let admin_username = this.adminSaveForm.get("admin_username").value;
    let admin_password = this.adminSaveForm.get("admin_password").value;
    let userPhone = this.adminSaveForm.get("admin_phone").value;
    let state = this.selectedState!==undefined?this.selectedState:this.userInfo.stateName;
    console.log("this.validAPhone",this.validAPhone);
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    let formObj = {
      schoolid: this.schoolId,
      name: this.validAUName,
      username: admin_username,
      password: admin_password,
      stateName:state,
      ccUser: this.selectedCountryCode,
      userPhone: userPhone,
      userLang:this.validULang,
    };
    if ((admin_username !== "" && admin_username !== undefined)&&(state != "" && state != undefined)&&(this.validULang != "" && this.validULang != undefined)) {
      this.http
        .post(this.url + "bully-buddy/admin/add_admin", formObj, {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Admin Added Successfully", type: true },
          });
          }else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Admin Adding Failed", type: false },
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
  }
  editAdmin() {
    let school_id = this.adminEditForm.get("admin_school_id").value;
    let admin_username = this.adminEditForm.get("admin_username").value;
    let admin_password = this.adminEditForm.get("admin_password").value;
    let stateName = this.selectedState === undefined||this.selectedState === null?this.validAState:this.selectedState;
    let userPhone = this.adminEditForm.get("admin_phone").value;
    console.log("this.validAPhone",this.validAPhone);
    console.log("this.selectedState",stateName)
    if (
      this.schoolId === "" ||
      this.schoolId === null ||
      this.schoolId === undefined
    ) {
      this.schoolId = this.adminSchoolId;
    }
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    let formData = {
      id: this.data.admin_id,
      schoolid: this.schoolId,
      userId: this.validAUId,
      name: this.validAUName,
      username: admin_username,
      password: admin_password,
      stateName: stateName,
      userPhone: userPhone,
      ccUser: this.validccAdmin,
      userLang:this.validULang,
    };
    if((admin_username != "" && admin_username != undefined)&&(stateName != "" && stateName != undefined)&&(this.validccAdmin != "" && this.validccAdmin != undefined)&&(this.validULang != "" && this.validULang != undefined)) {
      this.http
        .post(this.url + "bully-buddy/admin/update_admin", formData, {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Admin Update successfuly", type: true },
          });
          }else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Admin Update Failed", type: false },
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
  }
  dayFilter(eve) {
    this.selectedValue = eve;
  }
  selectGender(eve) {
    this.selectedGenderValue = eve;
  }
  selectCountryCode(eve){
    this.selectedCountryCode = eve;
    this.validccAdmin =eve;
  }
  busRouteDropDown(eve) {
    // console.log("BUS", eve);
    this.busRoute = eve;
  }
  userTypeDropDown(eve) {
    console.log(eve);
    this.userTypeId = eve;
    if (
      this.userTypeId !== "" ||
      this.userTypeId !== undefined ||
      this.userTypeId !== null
    ) {
      this.showFields = true;
      this.saveUserForm;
    }
    // console.log("VAlidEmail",this.validPassword);
  }
  userStateDropDown(eve) {
    console.log("state", eve);
    // console.log("opt", opt);
    this.selectedState = eve;
    this.validSState = eve;
    // &&(this.zipCodesrch !== undefined || this.zipCodesrch !== "")
    if (
      (this.selectedState !== undefined || this.selectedState !== "")
    ) {
      for(let i =0;i<this.stateList.length;i++){
        if(this.selectedState === this.stateList[i].statename){
            this.searchSchoolId = this.stateList[i].id
        }
      }
      console.log("searchSchoolId",this.searchSchoolId);
      // this.getSchoolByStateZip();
      // let formObj = {
      //   zipCode: this.zipCodesrch,
      // };
      // return new Promise((resolve, reject) => {
      //   this.http
      //     .post(
      //       this.url +
      //         "bully-buddy/school/get_school_by_statename_zipcode" +
      //         "?statename=" +
      //         this.selectedState,
      //       formObj
      //     )
      //     .subscribe((res: any) => {
      //       if (res.status == "200") {
      //         this.schoolList = res.result;
      //         console.log("SChpols", this.schoolList);
      //       } else {
      //         alert(res.message + " : " + res.result);
      //       }
      //       resolve();
      //     });
      // });
    }
  }

  searchSchool(eve) {
    // console.log("ZipCode", eve);
    this.zipCodesrch = eve;
    if (
      (eve !== "" || eve !== undefined) ||
      (this.selectedState !== "" || this.selectedState !== undefined)
    ) {
      // this.getSchoolByStateZip();
    }
    if(eve === "" || eve === undefined){
      this.zipCodesrch = null;
    }
  }

  getSchoolByStateZip() {
console.log("ZIP",this.zipCodesrch)
if(this.zipCodesrch===undefined||this.zipCodesrch===null){
  this.zipCodesrch="";
}
    let formObj = new FormData()
    formObj.append('zipCode',this.zipCodesrch)
      // zipCode: this.zipCodesrch,
    
    
    let selectedState: any;
    console.log("DATASTATE", this.data.state);
    console.log("selectedSATE", this.selectedState);
    if (
      this.data.state !== "" ||
      this.data.state !== undefined ||
      this.data.state !== null
    ) {
      // alert("Hit");
      this.selectedState = this.selectedState;
    } else {
      this.selectedState = this.data.state;
    }
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(
          this.url +
            "bully-buddy/school/get_school_by_statename_zipcode" +
            "?statename=" +
            this.selectedState,
          formObj, {headers: config()}
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.schoolList = res.result;
            this.allSchoolList = res.result;
            console.log("SChpols", this.schoolList);
            if (this.schoolList.length === 1) {
              this.editSchoolId = this.schoolList[0].id;
            }
          } else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          } else {
            alert(res.message + " : " + res.result);
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


  selectLanguage(eve){
      console.log(" this.validULang this.validULang",eve);
      this.validULang = eve;
  }

  saveUser() {
    // let school_name = this.saveForm.get("school_name").value;
    // let school_address = this.saveForm.get("school_address").value;

      //////  Validate the Fields ////

      this.validEmail = this.saveUserForm.get("email").value;
      this.validPassword = this.saveUserForm.get("password").value;
      this.validSchool = this.schoolId;
      this.validUName = this.saveUserForm.get("name").value;
      this.validUPhone = this.saveUserForm.get("userPhone").value;
      this.validState = this.selectedState;
      this.validccUser = this.selectedCountryCode;
    let age = this.validUAge;
    let parentPhone1;
    let busRoute;
    let ccUser = this.validccUser;
    let email = this.saveUserForm.get("email").value;
    let password = this.saveUserForm.get("password").value;
    let schoolId = this.schoolId;
    let userTypeId = this.userTypeId;
    let name = this.saveUserForm.get("name").value;
    let userPhone = this.saveUserForm.get("userPhone").value;
    let parentId = this.saveUserForm.get("parentId").value;
    let grade = this.saveUserForm.get("grade").value;
    if (this.userTypeId !== "1") {
      parentPhone1 = "0";
      this.validPPhone1 = parentPhone1;
    } else {
      parentPhone1 = this.saveUserForm.get("parentPhone1").value;
      this.validPPhone1 = parentPhone1;
    }

    let parentPhone2 = this.saveUserForm.get("parentPhone2").value;
    let driverPhone = this.saveUserForm.get("driverPhone").value;
    let schoolPhone = this.saveUserForm.get("schoolPhone").value;
    let gender = this.selectedGenderValue;

    let address = this.saveUserForm.get("address").value;
    let zipCode = this.saveUserForm.get("zipCode").value;
    let city = this.saveUserForm.get("city").value;
    // let state = this.saveUserForm.get("state").value;
    let state = this.selectedState;
    if (this.userTypeId === "1" ) {
      busRoute = this.busRoute;
    } else {
      busRoute = null;
    }
    // let isSocialUser = this.saveUserForm.get("isSocialUser").value;
    let socialMediaId = this.saveUserForm.get("socialMediaId").value;
    let fbCyber = this.saveUserForm.get("fbCyber").value;
    let instaCyber = this.saveUserForm.get("instaCyber").value;
    let snapShotCyber = this.saveUserForm.get("snapShotCyber").value;

    let formObj = {
      email: email,
      password: password,
      schoolId: schoolId,
      userTypeId: userTypeId,
      name: name,
      age: age,
      ccUser:this.selectedCountryCode,
      userPhone: userPhone,
      parentId: null,
      grade: grade,
      parentPhone1: parentPhone1,
      parentPhone2: parentPhone2,
      driverPhone: driverPhone,
      schoolPhone: schoolPhone,
      gender: this.selectedGenderValue,
      address: address,
      zipCode: zipCode,
      city: city,
      state: this.selectedState,
      busRoute: busRoute,
      isSocialUser: 0,
      socialMediaId: "",
      fbCyber: "",
      instaCyber: "",
      snapShotCyber: "",
      userLang:this.validULang,
      profileImage: this.profile_Image
    };
console.log("gender",gender);
console.log("schoolId",schoolId);

const config=()=>{
  let token=localStorage.getItem("BBToken");
  if(token!=""){
  return {Authorization:`Bearer ${token}`}
  }
}
// to show validation message

    if(email==''){

    }
    if(gender==undefined){
        alert("Please Enter gender.");
    }
    if(ccUser==undefined){
      alert("Please Enter Country Code.");
   }
   if(schoolId==null){
      alert("Please selecte State to add School in order to save.");
    }

    // End ///
console.log("SaveUSer",formObj);
    if ((name != "" && name != undefined)&&(gender=="M"||gender=="F")&&(schoolId!=null)&&(ccUser=="+1"||ccUser=="+91")) {
      this.http
        .post(this.url + "bully-buddy/user/add_user", formObj, {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "User Added Successfuly", type: true },
          });
          }else if(res.status == "302"){
            // this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: res.message, type: false },
          });
          }
          else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }
          else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "User Adding Failed", type: false },
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
  }

  userEmailChange(eve){
 let pattern=/^([_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|(\d+$)$/;
//  var phoneValidation= /^([\s\(\)\-]*\d[\s\(\)\-]*){8}$/;
//  var mailValidation= /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 if(eve.match(pattern)){
   this.validationEmail = false;
   console.log("match")
 }
 else{
  this.validationEmail = true;
   console.log("not match")
 }
  }

  editUSerAge(eve){
    this.validEditUAge = eve;
    console.log("Edit",this.validEditUAge)
  }
  editUser() {
    let validAge=true;
    let ccUser;
    let genderPass = true;
    // let school_name = this.saveForm.get("school_name").value;
    // let school_address = this.saveForm.get("school_address").value;
    let id = this.data.id;
    let email = this.editUserForm.get("email").value;
    // let password = this.editUserForm.get("password").value;
    let age =this.editUserForm.get("age").value;
    // let agee =this.validEditUAge;
    let schoolId = this.editSchoolId;
    let userTypeId = this.userTypeId;
    let name = this.editUserForm.get("name").value;
    let userPhone = this.editUserForm.get("userPhone").value;
    let parentId = this.editUserForm.get("parentId").value;
    let grade = this.editUserForm.get("grade").value;
    let parentPhone1 = this.editUserForm.get("parentPhone1").value;
    let parentPhone2 = this.editUserForm.get("parentPhone2").value;
    let driverPhone = this.editUserForm.get("driverPhone").value;
    let schoolPhone = this.editUserForm.get("schoolPhone").value;
    let gender =this.selectedGenderValue;
    let countryCode = this.selectedCountryCode;
    let address = this.editUserForm.get("address").value;
    let zipCode = this.editUserForm.get("zipCode").value;
    let city = this.editUserForm.get("city").value;
    // let state = this.editUserForm.get("state").value;
    let busRoute = this.editUserForm.get("busRoute").value;
    // console.log("AGE",agee)
    // console.log("this.validUAge",this.validUAge)
if(age === null||age=== undefined||age===""||age==="null"){
  age = "0";
  this.validEditUAge="0";
}
console.log("this.validUAge",this.validUAge)
if(countryCode == null&&countryCode == undefined){
  ccUser = this.validccUser;
  countryCode = this.validccUser;
}
else{
  ccUser = this.selectedCountryCode;
}
    let formObj = {
      id: id,
      email: email,
      // password: password,
      schoolId: schoolId,
      userTypeId: userTypeId,
      name: name,
      age:parseInt(age),
      ccUser:ccUser,
      userPhone: userPhone,
      parentId: this.parentId,
      grade: grade,
      parentPhone1: parentPhone1,
      parentPhone2: parentPhone2,
      driverPhone: driverPhone,
      schoolPhone: schoolPhone,
      gender: this.selectedGenderValue,
      address: address,
      zipCode: zipCode,
      city: city,
      state: this.selectedState,
      busRoute: this.busRoute,
      userLang:this.validULang,
      profileImage: this.profile_Image
    };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    console.log("schoolId",schoolId);
    console.log("deriverdriveer",this.driverDropDown);
    // console.log("agee",agee);
    if(schoolId==null){
      alert("Please selecte State to add School in order to save.");
    }
    if(this.userTypeId===1&&gender==undefined){
      genderPass = false;
        alert("Please Enter gender.");
    }
    if(countryCode==undefined&&this.validccUser==undefined){
      alert("Please Enter Country Code.");
  }
    if(this.userTypeId===1&&(age===0||age==="0")){
      validAge =false
      alert("Please Enter age.");
    }
    // if(this.userTypeId===1&&age===0)
    // {
    //   validAge =true;
    // }
    // console.log("age",agee);
    console.log("this.validUAge",this.validEditUAge)

    if ((name != "" && name != undefined)&&(genderPass === true)&&(schoolId!=null)&&(validAge === true)&&(countryCode=="+1"||countryCode=="+91")) {
      console.log("User", formObj);
      this.http
        .post(this.url + "bully-buddy/user/update_user", formObj, {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "User Update Successfully", type: true },
          });
          }
          else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }
          else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "User Update Failed", type: false },
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
  }
  selectBullyGender(eve) {
    this.selectedBullyGender = eve;
  }
  selectBullyClass(eve) {
    this.selectedBullyClass = eve;
  }
  selectBullyStatus(eve) {
    this.selectedBullyStatus = eve;
  }
  saveIncident() {
    // let school_name = this.saveForm.get("school_name").value;
    // let school_address = this.saveForm.get("school_address").value;

    let id = this.data.userId;
    let userId = this.editIncident.get("userId").value;
    let name = this.editIncident.get("name").value;
    let grade = this.editIncident.get("grade").value;
    let schoolId = this.schoolId;
    let age = this.editIncident.get("age").value;
    let gender = this.selectedGenderValue;
    let bullyName = this.editIncident.get("bullyName").value;
    let incidentPlace = this.editIncident.get("incidentPlace").value;
    let isBullyClassmate = this.selectedBullyClass;
    let bullyGender = this.selectedBullyGender;
    let noOfDaysBullied = this.editIncident.get("noOfDaysBullied").value;
    let bullyType = this.editIncident.get("bullyType").value;
    let bullyDescription = this.editIncident.get("bullyDescription").value;
    let videoURL = this.editIncident.get("videoURL").value;
    let bullyStatus = this.selectedBullyStatus;

    let formObj = {
      id: id,
      userId: userId,
      name: name,
      grade: grade,
      schoolId: schoolId,
      age: age,
      gender: gender,
      bullyName: bullyName,
      incidentPlace: incidentPlace,
      isBullyClassmate: isBullyClassmate,
      bullyGender: bullyGender,
      noOfDaysBullied: noOfDaysBullied,
      bullyType: bullyType,
      bullyDescription: bullyDescription,
      videoURL: videoURL,
      bullyStatus: bullyStatus,
    };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    if (name != "" && name != undefined) {
      this.http
        .post(this.url + "bully-buddy/incident/update_incident", formObj,{headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
          }
          else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }
          else{

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
  saveTeacher() {
    let teacher_name = this.saveTeacherForm.get("teacher_name").value;
    // let school_id = this.saveTeacherForm.get("school_id").value;
    let school_id = this.schoolId;
    let email = this.saveTeacherForm.get("teacher_email").value;
    let password = this.saveTeacherForm.get("teacher_password").value;
    let age = this.saveTeacherForm.get("teacher_age").value;
    let userPhone = this.saveTeacherForm.get("teacher_Phone").value;
    let grade = this.saveTeacherForm.get("grade").value;
    let gender = this.selectedGenderValue;
    let formObj = {
      email:email,
      schoolId: school_id,
      name: teacher_name,
      password:password,
      age:age,
      userPhone:userPhone,
      gender:gender,
      grade: grade,

    };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    if ((teacher_name != "" && teacher_name != undefined) && (school_id != undefined && school_id != "" && school_id != null)) {
      this.http
        .post(this.url + "bully-buddy/teachers/add_teacher", formObj, {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Teacher Added Successfully", type: true },
          });
          }
          else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }
          else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Teacher Adding Failed", type: false },
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
    else{
      alert("Kindly Select the School to save the Bus Route!")
    }
  }

  editTeacher() {
    let teacher_name = this.editTeacherForm.get("teacher_name").value;
    // let school_id = this.editTeacherForm.get("school_id").value;
    let school_id = this.schoolId;
    let grade = this.editTeacherForm.get("grade").value;
    let email = this.saveTeacherForm.get("teacher_email").value;
    let password = this.saveTeacherForm.get("teacher_password").value;
    let age = this.saveTeacherForm.get("teacher_age").value;
    let userPhone = this.saveTeacherForm.get("teacher_Phone").value;

    let gender = this.selectedGenderValue;
    let formObj = {
      id: this.data.id,
      name: teacher_name,
      schoolId: school_id,
      email:email,
      password:password,
      age:age,
      userPhone:userPhone,
      gender:gender,
      grade: grade,
    };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    if ((teacher_name != "" && teacher_name != undefined )&& (school_id != undefined && school_id != "" && school_id != null)) {
      this.http
        .post(this.url + "bully-buddy/teachers/update_teacher", formObj, {headers:config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Teacher Updated Successfully", type: true },
          });
          }
          else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }
          else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Teacher Update Failed", type: false },
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
    else{
      alert("Kindly Select the School to save the Bus Route!")
    }
  }

  saveBusRoute() {
    let busRoute = this.saveBusRouteForm.get("busRoute").value;
    let school_id = this.schoolId;
    let driver_id = this.saveBusRouteForm.get("driver_id").value;
    let formObj = {
      busRoute: busRoute,
      driverId: this.driverId,
      schoolId: school_id,
    };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    // if(this.schoolId != undefined || this.schoolId != ""){
    //   alert("Kindly Select the School to save the Bus Route!")
    // }
    if ((busRoute != "" && busRoute != undefined)&& (school_id != undefined && school_id != "" && school_id != null)) {
      this.http
        .post(this.url + "bully-buddy/busroute/add_busroute", formObj, {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "BusRoute Added Sucessfully", type: true },
          });
          }
          else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }
          else{
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "BusRoute Adding Failed", type: false },
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
    else{
      alert("Kindly Select the School to save the Bus Route!")
    }
  }

  editBusRoute() {
    console.log("this.data.id",this.editDriverId);
    let busRoute = this.editBusRouteForm.get("busRoute").value;
    let school_id = this.schoolId;
    let driver_id = this.editBusRouteForm.get("driver_id").value;
    let formObj = {
      id: this.editDriverId,
      busRoute: busRoute,
      driverId: parseInt(this.driverId),
      schoolId: school_id,
    };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    //  if(this.schoolId!== undefined || this.schoolId !== ""){
    //   alert("Kindly Select the School to save the Bus Route!")
    // }
    if ((busRoute != "" && busRoute != undefined) && (school_id != undefined && school_id != "" && school_id != null)) {
      this.http
        .post(this.url + "bully-buddy/busroute/update_busroute", formObj, {headers:config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.driverUniqueName = [];
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "BusRoute Updated Successfully", type: true },
          });
          }
          else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }
          else{
            this.driverUniqueName = [];
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "BusRoute Update Failed", type: false },
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
     else{
      alert("Kindly Select the School to save the Bus Route!")
    }
  }

  saveReport() {
    let userId = this.saveReportForm.get("userId").value;
    let school_id = this.schoolId;
    let fileURL = this.saveReportForm.get("fileURL").value;
    let latitude = this.saveReportForm.get("latitude").value;
    let langitude = this.saveReportForm.get("langitude").value;

    let formObj = {
      address: null,
      userId: userId,
      schoolId: school_id,
      fileURL: fileURL,
      latitude: latitude,
      langitude: langitude,
    };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    if (school_id != "" && school_id != undefined) {
      this.http
        .post(
          this.url + "bully-buddy/emergencyreport/add_emergencyreport",
          formObj, {headers: config()}
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Report Added Successfully ", type: true },
          });
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
            data: { value: "Report Adding Failed", type: false },
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
  }

  editBereavement(){
    let schoolDistrict = this.editBereavementForm.get("district").value;
    let formObj = {
      id: this.data.id,
      schoolDistrict:schoolDistrict
    };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    this.http
        .post(
          this.url + "bully-buddy/bereavement/update_bereavement",
          formObj, {headers: config()}
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: "School District Updated Sucessfully", type: true },
            });
          } else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }else{
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: "School District Updated Failled", type: false },
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

  editReport() {
    let userId = this.editReportForm.get("userId").value;
    let school_id = this.schoolId;
    // let address= this.editReportForm.get("address").value;
    let fileURL = this.editReportForm.get("fileURL").value;
    let latitude = this.editReportForm.get("latitude").value;
    let langitude = this.editReportForm.get("langitude").value;

    let formObj = {
      id: this.data.id,
      address: this.repAddress,
      userId: userId,
      schoolId: school_id,
      fileURL: fileURL,
      latitude: latitude,
      langitude: langitude,
    };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    if (userId != "" && userId != undefined) {
      this.http
        .post(
          this.url + "bully-buddy/emergencyreport/update_emergencyreport",
          formObj, {headers: config()}
        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.close();
          }
          else if (res.status === "504" || res.status === 504){
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            });
            this.router.navigateByUrl("/login");
          }
          else{

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

  onFileChange(event: any) {

    let pattern=/^([_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|(\d+$)$/;
    let mobilePattern ="?[7-9][0-9]{9}";

/// Convert Excel To Json Format......
    this.excel_file = event.target.files[0];
    console.log("Excel", this.excel_file);
    let worksheet;
    let workBook = null;
    let jsonData = [];
    let jsonData2 = [];
    let prexlsToJson = [];
    let prexlsToJson2 = [];
    const reader = new FileReader();
    const file =  event.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      this.excelValidationErrors = [];
      workBook =null;
      jsonData = [];
      jsonData2 = [];
      this.xlsToJson =[];
      workBook = XLSX.read(data, { type: 'binary' });
      // workBook.Strings.forEach((element,indx) => {
      //   if(indx<=21)
      //  { var str1 = new String(element.h);
      //   var index = str1.indexOf( "(Mandatory)" );
      //   var slicedStr = str1.slice(0,index)
      //   console.log("in",slicedStr)
      //   console.log("indexindex",index)
      //   if((element.h.includes("(Mandatory)")||element.h.includes("(Mandatory for student and Teacher)")))
      //   {
      //     workBook.Strings[indx]= {"h": slicedStr,
      //     "r": "<t>"+slicedStr+"</t>",
      //     "t": slicedStr}
      //   }}
      // });

  //     workBook.SheetNames.forEach((elem,ndx)=>{
  //       var sheetname = elem;
  //       workBook.Sheets.foreach((element11,index1) => {
  //         console.log("SHEEEEE",element11)
  //         element11[index1].forEach((element1,ind)=>{
  //           element1.forEach((element,indx) => {
  //             if(element !=="States"){
  //               element.forEach((element2,idx) => {
  //                 if(element2!=="!margins"&&element2!=="!!ref")
  //              {
  //             if(indx<=21)
  //            { var str1 = new String(element.h);
  //             var index = str1.indexOf( "(Mandatory)" );
  //             var slicedStr = str1.slice(0,index)
  //             console.log("in",slicedStr)
  //             console.log("indexindex",index)
  //             if((element2.h.includes("(Mandatory)")||element2.h.includes("(Mandatory for student and Teacher)")))
  //             {
  //               workBook.Sheets[indx]= {"h": slicedStr,
  //               "r": "<t>"+slicedStr+"</t>",
  //               "t": slicedStr}
  //             }}}
  //           });
            
  //         }
  //       });
  //         })
          
  // });
  //     });

var arrsheet =[];
var prexlsToJson3 = [];

//// To Replace the Header of the XLSX File before pushing in to the JSON.//////
  jsonData2 = workBook.SheetNames.reduce((initial, name) => {
    if(name !== "States"){
      var sht =workBook.Sheets[name]
      const sheet = workBook.Sheets[name];
     
      var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for(C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */

        var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
        if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        var str1 = new String(hdr);
          var index = str1.indexOf( "(" );
          var slicedStr = str1.slice(0,index)
          console.log("in",slicedStr)
          console.log("indexindex",index)
          var str2 = new String(hdr);
          // var index2 = str2.split(" ").join('');
          var slicedStr2 = str2.slice(0,index);
          slicedStr2 = slicedStr2.split(" ").join('');
          console.log("slicedStr2",slicedStr2);
          if((hdr.includes("(Mandatory)")||hdr.includes("(Mandatory_for_student_and_Teacher)")))
          {
            sheet[XLSX.utils.encode_cell({c:C, r:R})]= {"h": slicedStr2,
            "r": "<t>"+slicedStr2+"</t>",
            "t": "s",
            "v": slicedStr2,
            "w": slicedStr2}
          }
          else{
            sheet[XLSX.utils.encode_cell({c:C, r:R})]= {"h": str2,
            "r": "<t>"+str2+"</t>",
            "t": "s",
            "v": str2,
            "w": str2}
          }
         
        // headers.push(hdr);
    }
     
     }
     return initial;
     }, {});



      jsonData = workBook.SheetNames.reduce((initial, name) => {
      if(name !== "States"){
        const sheet = workBook.Sheets[name];
        // console.log("SHEETS",name)
       prexlsToJson.push(initial[name] = XLSX.utils.sheet_to_json(sheet));
       }
       return initial;
       }, {});

      /// Removing the First Row From the Each Sheet
      let SheetName= "";
      prexlsToJson.map((item,index)=>{
        SheetName = "Sheet"+(index+1);
        item.map((item2,index2)=>{
        if(index2 !== 0){
          var values = item2;
          // var tempName = "email(Mandatory)"
          // console.log("values",values.email_Mandatory)
          // if(values.email(Mandatory))
          // var val

         this.xlsToJson.push(item2)

        }
        })
      })
      /// end here ///

      // xlsToJson = xlsToJson[0].splice(0)

      // Replacing UserTypeId from String to Int
      this.xlsToJson.map((item2,index2)=>{
      
        // replace Json Key Names
          item2.email = item2.Email;
          delete item2.Email;
          item2.age = item2.Age;
          delete item2.Age;
          item2.ccUser = item2.CountryCode;
          delete item2.CountryCode;
          item2.gender = item2.Gender;
          delete item2.Gender;
          item2.grade = item2.Grade;
          delete item2.Grade;
          item2.name = item2.Name;
          delete item2.Name;
          item2.parentPhone1 = item2.ParentPhone1;
          delete item2.ParentPhone1;
          item2.password = item2.Password;
          delete item2.Password;
          item2.schoolId = item2.SchoolId;
          delete item2.SchoolId;
          item2.state = item2.State;
          delete item2.State;
          item2.userPhone = item2.UserPhone;
          delete item2.UserPhone;
          item2.userTypeId = item2.UserType;
          delete item2.UserType;
          item2.isSocialUser = item2.SocialUser;
          delete item2.SocialUser;
          if(item2.ParentPhone2)
          {
            item2.parentPhone2 = item2.ParentPhone2;
            delete item2.ParentPhone2;
          }
          if(item2.DriverPhone){
            item2.driverPhone = item2.DriverPhone;
            delete item2.DriverPhone; 
          }
          if(item2.SchoolPhone){
            item2.schoolPhone = item2.SchoolPhone;
            delete item2.SchoolPhone;
          }
          if(item2.Address){
            item2.address = item2.Address;
            delete item2.Address;
          }
          if(item2.ZipCode){
            item2.zipCode = item2.ZipCode;
            delete item2.ZipCode;
          }
          if(item2.City){
            item2.city = item2.City;
            delete item2.City;
          }
          if(item2.BusRoute){
            item2.busRoute = item2.BusRoute;
            delete item2.BusRoute;
          }
          if(item2.ProfileImage){
            item2.profileImage = item2.ProfileImage;
            delete item2.ProfileImage;
          }
          if(item2.SocialUser){
            item2.isSocialUser = item2.SocialUser;
            delete item2.SocialUser;
          }
          if(item2.UserLanguage){
            item2.userLang = item2.UserLanguage;
            delete item2.UserLanguage;
          }
        // };

        if(item2.ccUser === 1){
          item2.ccUser = "+1"
        }
        if(item2.isSocialUser === "Yes"){
          item2.isSocialUser = 1;
        }
        else{
          item2.isSocialUser = 0;
        }
        if(item2.ccUser === 91){
          item2.ccUser = "+91"
        }
        if(item2.userTypeId === "Student"){
          item2.userTypeId = 1;
        }
        else if(item2.userTypeId === "Teacher"){
          item2.userTypeId = 2;
        }
        else if(item2.userTypeId === "BusDriver"){
          item2.userTypeId = 4;
        }
        else{
          item2.userTypeId = 5;
        }

      });
      /// end here ///

      console.log("xlsToJson",this.xlsToJson);
      console.log("prexlsToJson",prexlsToJson);
     
      /// Validation of the Columns
     
      if(prexlsToJson[0].length <= 1){
        this.excelValidationErrors.push("Sheet is Empty" );
      }
      prexlsToJson.map((item,index)=>{
        // console.log("item",item);
          item.map((item2,index2)=>{
            if(index2+2 !== 2){
            if(!item2.email){
              this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" Email is missing");
            }
            // if(item2.email !== pattern.){
            //   this.excelValidationErrors.push("Row "+ (index2+2) +" Enter a Valid Email");
            // }
            if(!item2.password){
              this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" Password is missing");
            }
            if(!item2.schoolId){
              this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" schoolId is missing");
            }
            if(item2.schoolId&&(this.userInfo.schoolid !== item2.schoolId)){
              this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" Enter Valid schoolId");
            }
            if(!item2.userTypeId){
              this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" userTypeId is missing");
            }
            if(!item2.name){
              this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" Name is missing");
            }
            if(!item2.gender){
              this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" Gender is missing");
            }
            if(!item2.userPhone){
              this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" User PhoneNo is missing");
            }
            if(!item2.state){
              this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" state is missing");
            }
            if(item2.state&&(this.userInfo.stateName !== item2.state)){
              this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" Enter Valid state");
            }
            if(!item2.ccUser){
              this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" Country Code is missing");
            }
            if(!item2.userLang){
              this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" User Language is missing");
            }
            console.log("item2.ccUseritem2.ccUser",item2.ccUser)
            if(item2.ccUser&&(item2.ccUser !=="+1"&&item2.ccUser !=="+91")){
              this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" Enter Valid Country Code");
            }
            // if(item2.userPhone.matches(mobilePattern)){
            //   this.excelValidationErrors.push("Row "+ (index2+2) +" Enter Valid User PhoneNO");
            // }
            if(item2.userTypeId === 1){
              // item2.userTypeId = 1;
              if(!item2.age){
                this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" AGE is missing");
              }
              if(!item2.parentPhone1){
                this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" Parent PhoneNo is missing");
              }
              if(!item2.grade){
                this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" Grade is missing");
              }
              // if(item2.parentPhone1 < 0){
              //   this.excelValidationErrors.push("Row "+ (index2+2) +" Enter Valid Parent PhoneNO");
              // }
            }
            if(item2.userTypeId === 2){
              // item2.userTypeId = 2;
              if(!item2.grade){
                this.excelValidationErrors.push("Sheet " + (index+1) +" Row "+ (index2+2) +" Grade is missing");
              }
            }
            // else if(item2.userTypeId === "Bus Driver"){
            //   item2.userTypeId = 4;
            // }
            // else{
            //   item2.userTypeId = 5;
            // }
            }
          })
      })
      /// End ///
      
      const dataString = JSON.stringify(jsonData);
     
    }
    reader.readAsBinaryString(file);
    event.srcElement.value = null;
  }

  saveExcel() {
    // this.showLoading = true;
    let url;
    let formObj: FormData = new FormData();
    formObj.set("file", this.excel_file);
    formObj.set("filename", this.data.fileName);
    formObj.set("adminid", this.userInfo.id);
    let message = "Uploaded the file successfully: " + this.excel_file.name;
    // console.log("Name", message);
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    if(this.title === "Upload BusRoute Excel"|| this.title === "Upload School Excel")
   {
    // console.log("ExcelUpload", formObj);
    this.excelValidationErrors = [];
     url = this.url+"bully-buddy/excel/upload_excel";

    if(this.excelValidationErrors.length === 0){
      this.showLoading = true;
    this.http.post(url, formObj, {headers: config()}).subscribe(
      (res: any) => {
        console.log("RESS", res);
        // this.showLoading = true;
        if (res.message == message) {
          this.showLoading = false;
          this.close();
          this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Excel Uploaded", type: true },
          });
        }
        else if (res.status === "504" || res.status === 504){
          this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: res.message + " : " + res.result + "You have been logout", type: false },
          });
          this.router.navigateByUrl("/login");
        }

      },
      (error) => {
        console.log("ERR", error);
        if (error.status === 504){
          alert("You have been logout");
            this.router.navigateByUrl("/login");
          }
          else
        {
        this.showLoading = false;
        // if (error instanceof HttpErroResponse) {
        this.alertDialog.open(SuccessComponent, {
          width: "30%",
          data: { value: error.error.message, type: false },
        });
        }
      }
    );
    }
    }
    if(this.title === "Upload User Excel")
    {
      url = this.url+"bully-buddy/user/upload_excel";
      console.log("UserExcelUpload", this.xlsToJson);
      if(this.excelValidationErrors.length === 0){
        this.showLoading = true;
        this.http.post(url, this.xlsToJson, {headers: config()}).subscribe(
          (res: any) => {
            console.log("RESS", res);
            // this.showLoading = true;
            if (res.message == "File Uploaded Successfully") {
              this.showLoading = false;
              this.close();
              this.alertDialog.open(SuccessComponent, {
                width: "30%",
                data: { value: "Excel Uploaded", type: true },
              });
            }
            if(res.status === 302){
              this.showLoading = false;
              this.alertDialog.open(SuccessComponent, {
                width: "30%",
                data: { value:res.message, type: false },
              });
            }
            if(res.status === 400){
              this.showLoading = false;
              this.alertDialog.open(SuccessComponent, {
                width: "30%",
                data: { value:res.message, type: false },
              });
            }
            if (res.status === "504" || res.status === 504){
              this.alertDialog.open(SuccessComponent, {
                width: "30%",
                data: { value: res.message + " : " + res.result + "You have been logout", type: false },
              });
              this.router.navigateByUrl("/login");
            }
          },
          (error) => {
            console.log("ERR", error);
            
            if (error.status === 504){
              alert("You have been logout");
                this.router.navigateByUrl("/login");
              }
              else
            {
              this.showLoading = false;
            
            this.alertDialog.open(SuccessComponent, {
              width: "30%",
              data: { value: error.error.message, type: false },
            });
            }
              
            
          }
        );
        }
     }

  }

  getAllSchools() {
    // this.totalRecords = 0;
    // this.page = 1;
    console.log("ALLSCHOOLLIST",this.allSchoolList.length)
    if(this.allSchoolList.length===0){
      const config=()=>{
        let token=localStorage.getItem("BBToken");
        if(token!=""){
        return {Authorization:`Bearer ${token}`}
        }
      }
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.url + "bully-buddy/school/get_all_school", "", {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.allSchoolList = res.result;
            // this.adminSchoolList = res.result;
            // this.schoolList = res.result;
            console.log("SChpols", this.allSchoolList);
            // this.data = res.result;
            // this.totalRecords = res.result.length;
            // this.zipCodeItem.push(this.dataList.zipCode);
            // console.log("TOTOAL", this.totalRecords);
            // console.log("TOTOAL", this.dataList);
            // for (let i = 0; i < this.totalRecords; i++) {
            //   if (
            //     this.dataList[i].zipCode !== undefined ||
            //     this.dataList[i].zipCode !== "" ||
            //     this.dataList[i].zipCode !== null
            //   ) {
            //     if (this.zipCodeItem[i] !== this.dataList[i].zipCode) {
            //       this.zipCodeItem.push(this.dataList[i].zipCode);
            //     }
            //   }
            // }
            // console.log("zipCodeItem", this.zipCodeItem);
          } if (res.status === "504" || res.status === 504){
            // this.alertDialog.open(SuccessComponent, {
            //   width: "30%",
            //   data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            // });
           // alert(res.message + " : " + res.result+ "You have been logout");
            this.router.navigateByUrl("/login");
          }else {
            alert(res.message + " : " + res.result);
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
  }
  getAllUserTypes() {
    // let formObj = {
    //   schoolId: this.userInfo.schoolid,
    // };
    let length;
    let userType;
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.url + "bully-buddy/usertype/get_all_usertype",'', {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            length = res.result.length;
            userType = res.result;
            this.userTypeList = res.result;
            for (let i = 0; i < length; i++) {
            //   if (res.result[i].id !== 3) {
            // this.userTypeList.push(userType[i]);
            //   }
              if (res.result[i].id !== 3 && res.result[i].id !== 5) {
                this.userTypeList2.push(userType[i]);
                  }
            }
            console.log("USER", this.userTypeList);
          } 
          if (res.status === "504" || res.status === 504){
            // this.alertDialog.open(SuccessComponent, {
            //   width: "30%",
            //   data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            // });
            //alert(res.message + " : " + res.result+ "You have been logout");
            this.router.navigateByUrl("/login");
          }
          else {
            // alert(res.message + " : " + res.result);
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

  getAllBusRoute() {
    let formObj = {
      schoolId: this.userInfo.schoolid,
    };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    if(this.schoolId!==null&&this.schoolId!=="null")
  {  return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.url + "bully-buddy/busroute/get_all_busroute", formObj, {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.busRouteList = res.result;
            // this.data = res.result;
            // this.totalRecords = res.result.length;
            console.log("BUS1", this.busRouteList);
            // this.data = res.result;

            // this.UniqueName = this.busRouteList.filter((value, index, self) => self.map(x => x.name).indexOf(value.name) == index)
            this.uniqueDriver = this.driverName.filter(({name:id1}) => !this.busRouteList.some(({name:id2 }) => id2 === id1))
            console.log("this.uniqueDriver",this.uniqueDriver);
            this.driverUniqueName = this.uniqueDriver;
            console.log("this.driverUniqueName",this.driverUniqueName);
            if(this.driverUniqueName.length === 0){

              this.showNoDriver = true;
            }
            else{
              this.showNoDriver = false;
            }
            if(this.driverUniqueName.length === 0){

              // debugger;
              this.busRouteList.map((item)=>{
                if((item.driverId === this.validBDId)&&(item.driverId !== this.editDriverDummy.id))
                {
                  this.editDriverDummy.push({"name":item.name,"id":item.driverId});
                }
              });
              this.editDriverDummy = this.editDriverDummy.filter((value, index, self) => self.map(x => x.name).indexOf(value.name) == index)
              // console.log("selffilter",selffilter);
              console.log("Dummy",this.editDriverDummy);
            }
            else{
              this.driverUniqueName.map((item)=>{
                console.log("Dummyyyyy",this.editDriverDummy);
                this.editDriverDummy.push({"name":item.name,"id":item.id});
              });
              this.busRouteList.map((item)=>{
                if((item.driverId === this.validBDId) &&(item.driverId !== this.editDriverDummy.id))
                {
                  this.editDriverDummy.push({"name":item.name,"id":item.driverId});
                }
              });
              this.editDriverDummy = this.editDriverDummy.filter((value, index, self) => self.map(x => x.name).indexOf(value.name) == index)
            }

          }
          if (res.status === "504" || res.status === 504){
            // this.alertDialog.open(SuccessComponent, {
            //   width: "30%",
            //   data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            // });
            //alert(res.message + " : " + res.result+ "You have been logout");
            this.router.navigateByUrl("/login");
          }
           else {
            // alert(res.message + " : " + res.result);
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
  }
  getBusRouteById() {
    let arrLen: any = [];
    let formObj = {
      id: this.schoolId,
    };
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.url + "bully-buddy/busroute/get_busroute_by_id", formObj,{headers:config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            // this.dataList.push(res.result);
            // this.dataList.push(this.dataList);
            arrLen.push(res.result);
            // console.log("RESsss", arrLen);
            if (arrLen.length === 1) {
              // this.dataList = [];
              // this.dataList.push(res.result);
              this.data = res.result;
              // this.totalRecords = res.result.length;
            } else {
              // this.dataList = res.result;
              this.data = res.result;
              // this.totalRecords = res.result.length;
            }
            console.log("DATALIST", this.data);
          }
          if (res.status === "504" || res.status === 504){
            // this.alertDialog.open(SuccessComponent, {
            //   width: "30%",
            //   data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            // });
            //alert(res.message + " : " + res.result+ "You have been logout");
            this.router.navigateByUrl("/login");
          }
           else {
            // alert(res.message + " : " + res.result);
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
    // searchSchools(ev){
    //   console.log("SearchSchool",ev.term);

    // }

   getSchoolBySearch(school) {
     console.log("SearchSchool",school.term);
console.log("ZIP",this.zipCodesrch)
const config=()=>{
  let token=localStorage.getItem("BBToken");
  if(token!=""){
  return {Authorization:`Bearer ${token}`}
  }
}
if(this.zipCodesrch===undefined||this.zipCodesrch===null||this.zipCodesrch===""){
  this.zipCodesrch=null;
}

    let selectedState: any;
    console.log("DATASTATE", this.data.state);
    console.log("selectedSATEs", this.selectedState);
    if (
      (this.selectedState !== undefined || this.selectedState !== "")
    ) {
      for(let i =0;i<this.stateList.length;i++){
        if(this.selectedState === this.stateList[i].statename){
            this.searchSchoolId = this.stateList[i].id
        }
      }
    }
    else{
      this.searchSchoolId = 0;
    }

 let formObj =new FormData();
 
 formObj.append("stateId",this.searchSchoolId)
 if(this.zipCodesrch !== null)
 {
   formObj.append("zipCode",this.zipCodesrch)
  }
 formObj.append("schoolName",school.term)
    //   stateId: this.searchSchoolId,
    //   zipCode: this.zipCodesrch,
    //   schoolName: school.term
    // };

    return new Promise<void>((resolve, reject) => {
      this.http
        .post(
          this.url +
            "bully-buddy/school/get_school_auto",
          formObj, {headers: config()}        )
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.schoolList = res.result;
            this.allSchoolList = res.result;
            // console.log("SChpols", this.schoolList);
            if (this.schoolList.length === 1) {
              this.editSchoolId = this.schoolList[0].id;
            }
          }
          if (res.status === "504" || res.status === 504){
            // this.alertDialog.open(SuccessComponent, {
            //   width: "30%",
            //   data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            // });
            //alert(res.message + " : " + res.result+ "You have been logout");
            this.router.navigateByUrl("/login");
          }
           else {
            // alert(res.message + " : " + res.result);
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
   getSchoolById(school) {
     console.log("SchoolIDD",school);
    let arrLen: any = [];
    let formObj = new FormData();
    formObj.append('id',school)
      
    const config=()=>{
      let token=localStorage.getItem("BBToken");
      if(token!=""){
      return {Authorization:`Bearer ${token}`}
      }
    }
    if(school !== ""||school!==0||school!==undefined){
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.url + "bully-buddy/school/get_school_by_id", formObj, {headers: config()})
        .subscribe((res: any) => {
          if (res.status == "200") {
            // this.dataList.push(res.result);
            // this.dataList.push(this.dataList);

              // this.schoolList.push(res.result);
              this.allSchoolList.push(res.result);
// console.log("schoolbyid",this.schoolList);
              this.dropSchoolName= this.allSchoolList[0].schoolName
              if(this.userInfo.schoolid !== 0){
              this.schoolId = this.allSchoolList[0].id;
              if(this.dropSchoolName === "Others"){
                this.schoolId = 0;
                this.editSchoolId = 0;
              }
            }
            if(this.dropSchoolName === "Others"){
              this.schoolId = 0;
              this.editSchoolId = 0;
            }
            console.log("dropSchoolName", this.allSchoolList);
          }if (res.status === "504" || res.status === 504){
            // this.alertDialog.open(SuccessComponent, {
            //   width: "30%",
            //   data: { value: res.message + " : " + res.result + "You have been logout", type: false },
            // });
            //alert(res.message + " : " + res.result+ "You have been logout");
            this.router.navigateByUrl("/login");
          } else {
            // alert(res.message + " : " + res.result);
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
  }
}
