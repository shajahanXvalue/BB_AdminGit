import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PropertyServiceService {

  // uri= "https://www.bullyingbuddyapp.com/java-service-admin/";
   uri = "https://bullyingbuddyapp.com/java-service-admin/";

  //  uri = "http://3.128.136.18:5001/";
  // uri = "https://service-admin-api.bullyingbuddyapp.com/";

  fileUrl = "https://bullingbuddy.s3-us-west-1.amazonaws.com/";
  // fileUrl2 = "https://bullingbuddy.s3-us-west-1.amazonaws.com";
  fileUrl3 = "https://bullybucket.s3-us-west-2.amazonaws.com/";
  constructor() {}
}

// old IP:http://54.215.34.67:5001/
