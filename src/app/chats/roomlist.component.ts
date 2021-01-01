import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

// import core firebase client (required)
import * as firebase from "firebase/app";
// import "firebase/auth";
import "firebase/firestore";
import { ChatService } from "./chat.service";

var firebaseConfig = {
  apiKey: "AIzaSyD2F4E6f8iTq7GFRo_WWgPCyZSb5zFQLu8",
  authDomain: "bullingbuddy.firebaseapp.com",
  databaseURL: "https://bullingbuddy.firebaseio.com",
  projectId: "bullingbuddy",
  storageBucket: "bullingbuddy.appspot.com",
  messagingSenderId: "741765502191",
  appId: "1:741765502191:web:a2f210093e336fc881371a",
  measurementId: "G-H0XKSH0LPH",
};

// export const snapshotToArray = (snapshot: any) => {
//   const returnArr = [];

//   snapshot.forEach((childSnapshot: any) => {
//     const item = childSnapshot.val();
//     item.key = childSnapshot.key;
//     returnArr.push(item);
//   });

//   return returnArr;
// };

@Component({
  selector: "app-roomlist",
  templateUrl: "./roomlist.component.html",
  styleUrls: ["./roomlist.component.css"],
})
export class RoomlistComponent implements OnInit {
  userId = JSON.parse(localStorage.getItem("UserInfo"));
  selectedIndex = 0;
  userMessage = [];
  allChatUser = [];
  submitted = false;
  show = false;
  searchText;
  messageText = "";
  message: "";
  formId = "";
  apiType = "";
  userChatId = "";
  chatName = "";
  groupDeviceToken = [];
  oneToOneDeviceToken = [];
  groupNameData = [];
  url = "https://bullyingbuddyapp.com/java-service-admin";

  // ref = firebase.firestore().collection("testMessages");
  messageForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public datepipe: DatePipe,
    private http: HttpClient,
    public dialog: MatDialog,
    public alertDialog: MatDialog,
    private formBuilder: FormBuilder,
    private chat: ChatService
  ) {}

  ngOnInit() {
    this.messageForm = this.formBuilder.group({
      message: ["", Validators.required],
      chatId: [""],
      from: [""],
    });
    this.onReset();
    this.getOneChatUser();
    this.getGroupChatUser();
  }

  get f() {
    return this.messageForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.messageText = "";
    // stop here if form is invalid
    const date = new Date().toUTCString();
    // console.log("this.messageForm", this.messageForm.value);
    if (this.messageForm.valid) {
      const id = this.formId;
      const data = {
        chatId: this.userChatId,
        currentUserId: this.userId.id,
        date: date,
        from: this.formId,
        isRead: "Not",
        text: this.messageForm.value.message,
      };
      this.messageText = this.messageForm.value.message;
      // console.log("submit", data);
      if (this.apiType == "one") {
        return new Promise((resolve, reject) => {
          this.chat.postOneMess(id, data).subscribe((res: any) => {
            this.sentMess();
            this.onReset();
            let data = JSON.parse(localStorage.getItem("doc"));
            this.getMessage(data.type, data.id);
          });
          resolve();
        });
      } else {
        return new Promise((resolve, reject) => {
          this.chat.postGroupMess(id, data).subscribe((res: any) => {
            this.sentMess();
            this.onReset();
            let data = JSON.parse(localStorage.getItem("doc"));
            this.getMessage(data.type, data.id);
          });
          resolve();
        });
      }
    }
  }

  onReset() {
    this.submitted = false;
    this.messageForm.reset();
  }

  public setRow(_index) {
    this.formId = "";
    this.apiType = "";
    this.userChatId = "";

    this.selectedIndex = _index.index;
    this.show = true;
    this.messageForm.setValue({
      message: "",
      chatId: JSON.stringify(_index.chatId),
      from: JSON.stringify(_index.docId),
    });
    let store = {
      type: _index.userType,
      id: JSON.stringify(_index.docId),
    };
    localStorage.setItem("doc", JSON.stringify(store));
    // console.log("click formId ", JSON.stringify(_index.docId));
    this.formId = JSON.stringify(_index.docId);
    this.apiType = _index.userType;
    this.chatName = _index.name;
    this.userChatId = JSON.stringify(_index.chatId);
    this.getMessage(_index.userType, JSON.stringify(_index.docId));
    // console.log("chatCount", _index.docId);
    this.groupTypeApi(_index.userType, _index.chatId);
    let data = JSON.parse(localStorage.getItem("doc"));
    setInterval(() => {
      this.getMessage(data.type, data.id);
    }, 2000);
  }

  getMessage(userType, docId) {
    if (userType == "one") {
      this.chat.getOneMessageById(docId).subscribe((data) => {
        // console.log("data", data);
        this.userMessage = data;
      });
    } else {
      this.chat.getMessageById(docId).subscribe((data) => {
        // console.log("data", data);
        this.userMessage = data;
      });
    }
  }

  groupTypeApi(userType, userChatID) {
    if (userType == "one") {
      const formData = new FormData();
      formData.append("userId", userChatID);
      return new Promise((resolve, reject) => {
        this.http
          .post(
            this.url + "/bully-buddy/push_config/get_device_token",
            formData
          )
          .subscribe((res: any) => {
            this.oneToOneDeviceToken = [];
            // console.log("one to one 1", res);
            if (res.status == "200") {
              this.oneToOneDeviceToken.push({
                token: res.result,
                id: "",
                userTypeId: "",
              });
              // console.log("one to one 2", res);
            }
          });
        resolve();
      });
    } else {
      const formData = new FormData();
      formData.append("chatId", userChatID);
      return new Promise((resolve, reject) => {
        this.http
          .post(
            this.url + "/bully-buddy/chat/get_device_tokens_by_chatId",
            formData
          )
          .subscribe((res: any) => {
            // console.log("group 1", res);
            this.oneToOneDeviceToken = [];
            if (res.status == "200") {
              // console.log("group 1", res);
              res.result.forEach((element) => {
                this.oneToOneDeviceToken.push({
                  token: element.deviceToken,
                  id: element.id,
                  userTypeId: element.userTypeId,
                });
              });
            }
          });
        resolve();
      });
    }
  }
  ngOnChanges() {
    this.getOneChatUser();
    this.getGroupChatUser();
  }

  getOneChatUser() {
    const formData = new FormData();
    formData.append("id", this.userId.id);
    formData.append("userTypeId", "5");

    return new Promise((resolve, reject) => {
      this.http
        .post(this.url + "/bully-buddy/user/get_chat_group_ids", formData)
        .subscribe(
          (res: any) => {
            if (res.status == "200") {
              res.result.forEach((e) => {
                this.allChatUser.push({
                  Id: e.Id,
                  Name: e.Name,
                  chatGroupType:
                    e.User_Type_Id == 1
                      ? "Student"
                      : e.User_Type_Id == 2
                      ? "Teacher"
                      : e.User_Type_Id == 3
                      ? "Parent"
                      : e.User_Type_Id == 4
                      ? "Driver"
                      : e.User_Type_Id == 5
                      ? "Admin"
                      : "",
                  User_Type_Id: e.User_Type_Id,
                  userImg:
                    e.User_Type_Id == 1
                      ? "student_chat.png"
                      : e.User_Type_Id == 2
                      ? "teacher1.png"
                      : e.User_Type_Id == 3
                      ? "family_chat.png"
                      : e.User_Type_Id == 4
                      ? "busdriver_chat.png"
                      : e.User_Type_Id == 5
                      ? "Admin"
                      : "administrator.png",
                  adminId: null,
                  parentId: null,
                  studentId: null,
                  userType: "one",
                  docId: e.Id + e.User_Type_Id + this.userId.id + 5,
                });
              });
              // console.log("resData2", this.allChatUser);
            }
          },
          (err) => console.log(err)
        );
      resolve();
    });
  }

  getGroupChatUser() {
    const formData = new FormData();
    formData.append("id", this.userId.id);
    formData.append("userTypeId", "5");

    return new Promise((resolve, reject) => {
      this.http
        .post(this.url + "/bully-buddy/chat/get_group_chatId", formData)
        .subscribe(
          (res: any) => {
            if (res.status == "200") {
              console.log("res->", res.result);

              res.result.forEach((e) => {
                var keyId = JSON.parse(e.chatId);
                this.chat
                  .getGroupNameById(JSON.stringify(e.studentId))
                  .subscribe((data) => {
                    // this.groupNameData = data;
                    data.forEach((s) => {
                      if (s.Id == keyId) {
                        // console.log("aaaaa", s.Name);
                        this.allChatUser.push({
                          Id: e.chatId,
                          Name: s.Name,
                          chatGroupType: "GroupChat",
                          User_Type_Id: null,
                          userImg: "groupChat.png",
                          adminId: e.adminId,
                          parentId: e.parentId,
                          studentId: e.studentId,
                          userType: "group",
                          docId: e.chatId,
                        });
                      }
                    });
                  });
              });
            }
          },
          (err) => console.log(err)
        );
      resolve();
    });
  }

  sentMess() {
    this.oneToOneDeviceToken.forEach((e) => {
      this.sentDeviceMess(e.token, e.id);
    });
  }

  sentDeviceMess(deviceToken, id) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization:
          "key=AAAArLSrVO8:APA91bFkSp19F8_78VCbIYvqRelYfekKAfgyf-ssBjxBkktNDcqCxw1vc2W8ZkfhnavufM-szWif9JQE5QwNa2hxjhzzlvri3QxMYUvsBT-br6sapWpZT81VW1DKzrdEzsWRz2GwS_qA",
        "Content-Type": "application/json",
      }),
    };
    const jsonEncode = {
      to: deviceToken,
      notification: {
        body: this.messageText,
        title: this.userId.username,
        badge: "1",
        sound: "ring.mp3",
      },
      priority: "high",
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        id: this.apiType == "one" ? "1" : "2",
        status: "done",
        chatroomid: this.userChatId,
      },
    };

    return new Promise((resolve, reject) => {
      this.http
        .post("https://fcm.googleapis.com/fcm/send", jsonEncode, httpOptions)
        .subscribe((res: any) => {
          console.log("successMessage", res);
        });
      resolve();
    });
  }
}
