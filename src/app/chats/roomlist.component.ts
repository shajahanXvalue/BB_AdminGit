import { Component,AfterViewChecked, ElementRef, ViewChild, OnInit } from "@angular/core";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { DatePipe, KeyValue } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NotifierService } from 'angular-notifier';
// import core firebase client (required)
import * as firebase from "firebase/app";
import "firebase/firestore";
import { ChatService } from "./chat.service";
import { ItemComponent } from "ngx-dropdown-list/src/ngx-dropdown-list/item/item.component";
// import { timeStamp } from 'console';
import { CookieService } from "ngx-cookie-service";
import { PropertyServiceService } from "../property-service.service";

@Component({
  selector: "app-roomlist",
  templateUrl: "./roomlist.component.html",
  styleUrls: ["./roomlist.component.css"],
})
export class RoomlistComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollBottom') private scrollBottom: ElementRef;

  audio = new Audio();
  userId = JSON.parse(localStorage.getItem("UserInfo"));
  selectedIndex = 0;
  count=0;
  newMessage=0;
  showNoChat:boolean=false;
  userMessage = [];
  allChatUser = [];
  submitted = false;
  SortbyParam = "chatDate";
  SortDirection = "desc";
  show = false;
  OneChatUser = [];
  GroupChatUser = [];
  searchText;
  messageText = "";
  message: "";
  formId = "";
  chatCountNo = "";
  totalcount= '';
  ref = "";
  apiType = "";
  userChatId = "";
  chatName = "";
  timer = null;
  isNotRead = [];
  groupDeviceToken = [];
  oneToOneDeviceToken = [];
  groupNameData = [];
  group = null;
  userChatCount ="0";
  groupChatCount = "0";
  // url = "https://bullyingbuddyapp.com/java-service-admin";
  chatUser_Type_Id = "";
  currentChat ="";
  // unReadCount = [];
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
    private chat: ChatService,
    private cookieService: CookieService,
    private notifier: NotifierService,
    private property: PropertyServiceService,
  ) {
    this.notifier = notifier;
  }
  url = this.property.uri;
  getCookies: string = this.cookieService.get("LoginStatus");
  get sortData() {
    let oneChatCount = localStorage.getItem("OneChatUserLength");
     let GroupChatUserlength = localStorage.getItem("GroupChatUserlength");
    let chatList = localStorage.getItem("chatList");
    console.log("chatList",chatList);
    if((chatList === null || chatList === "0")){
       this.showNoChat = true;
        localStorage.setItem("chatList",this.allChatUser.length.toString());
    }
    else{
      this.showNoChat = false;
    }

    // if(!chatList.length){
    //   this.showNoChat = true;
    // }
    // else{
    //    this.showNoChat = false;
    // }
    //   if(this.newMessage > 0){

    //    this.showNoChat = false;
    // }

    return this.allChatUser.sort((a, b) => {
      return <any>new Date(b.chatDate) - <any>new Date(a.chatDate);
    });
  }

  refresh() {
    this.allChatUser = [];
    // this.newMessage=0;
    if(this.newMessage === 0){
        localStorage.setItem("OneChatcount",this.newMessage.toString())
      }
    this.startChatCountTimer();
    this.getOneChatUser();
    this.getGroupChatUser();
    // this.getOnechatFirebase();
    // this.getGroupChatFireBase();
    // this.startTimer();
    // this.addChatListData();
    // this.addChatListData();
  }

  ngOnInit() {
    // this.allChatUser =[];
    if (this.getCookies === "") {
      localStorage.removeItem("userInfo");
      // this.router.navigateByUrl("/login");
      // window.location.href = this.url+"admin/#/login";
      window.location.href="https://bullyingbuddyapp.com/admin/#/login";
    }
    if (this.userId === null || this.userId === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      // this.router.navigateByUrl("/login");
      // window.location.href = this.url+"admin/#/login";
      window.location.href="https://bullyingbuddyapp.com/admin/#/login";
    }
    // this.playAudio();
    // this.addChatListData();
    // this.addGroupList();
    this.newMessage=0;
    const date = new Date().toUTCString();
    const date1 = moment.utc(new Date()).format();
    // console.log("date formet", date, date1);
    this.messageForm = this.formBuilder.group({
      message: ["", Validators.required],
      chatId: [""],
      from: [""],
    });

    this.onReset();
    // this.getOnechatFirebase();
    // this.getGroupChatFireBase();
    this.getOneChatUser();
    this.getGroupChatUser();
    this.startChatCountTimer();
    // this.startTimer();
    // this.scrollToBottom();

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
   }

   scrollToBottom(): void {
       try {
           this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
       } catch(err) { }
   }
//  showNotification( type: string, message: string) {
//   this.notifier.show( {

//     message,
//     type
//   } );
// 	}
playAudio(){
  // this.setRow(this.currentChat);
  let OneChatcount= localStorage.getItem("OneChatcount")
  // console.log("this.newMessage",this.newMessage);
  if(parseInt(OneChatcount) < this.newMessage){
      this.playAudioo();
    localStorage.setItem("OneChatcount",this.newMessage.toString());
  }
  if(OneChatcount>=this.newMessage.toString()){
    // this.playAudioo();
    localStorage.setItem("OneChatcount",this.newMessage.toString());
  }
  if(this.newMessage === 0){
    localStorage.setItem("OneChatcount",this.newMessage.toString())
  }
}
playAudioo(){
  this.audio.src = "../../assets/music/service-bell_daniel_simion.mp3";
  this.audio.load();
  this.audio.play();

}

  get f() {
    return this.messageForm.controls;
  }

  addChatListData() {
    var apiData = [];
    var fireData = [];
    let length=0;

    const formData = new FormData();
    formData.append("id", this.userId.userId);
    formData.append("userTypeId", "5");

    return new Promise((resolve, reject) => {
      this.http
        .post(this.url + "/bully-buddy/user/get_chat_group_ids", formData)
        .subscribe((res: any) => {
          if (res.status == "200") {
            // console.log("list data", res.result);
            res.result.forEach((e) => {
              apiData.push({
                Id: e.Id,
                Name: e.Name,
                Grade:e.Grade,
                User_Type_Id: e.User_Type_Id,
              });
            });
            // count = res.result.length;
            this.chat
              .getOneNameById(JSON.stringify(this.userId.userId))
              .subscribe((data) => {
                console.log("list data1", data);
                data.forEach((es) => {
                  fireData.push({
                    Id: es.Id,
                    Name:es.Name,
                    User_Type_Id: es.User_Type_Id,
                    Grade:es.Grade
                  });
                });
              length= fireData.length;
              // console.log("fireData.length",fireData.length)
              // console.log("fireData.length",fireData)
              apiData.forEach((res) => {
                const dataAdd = {
                  Id: JSON.stringify(res.Id),
                  Name: res.Name,
                  unreadCount: "0",
                  Grade:res.Grade,
                  User_Type_Id: JSON.stringify(res.User_Type_Id),
                  updatedDateTime: new Date().toISOString(),
                };
                console.log("E>ID",length)
                console.log("dataAdd",dataAdd)
                if (length !== 0 && apiData.length===length) {
                  fireData.forEach((t) => {
                    // console.log("E>ID",res.Id)
                    // console.log("T.ID",t.Id)
                    let eId=JSON.stringify(res.Id);
                    eId = eId.toString();
                    let tId =t.Id
                    tId= tId.toString();
                    if (eId != tId) {
                      // console.log("HIT")
                      this.chat
                        .upsetDateData(
                          JSON.stringify(this.userId.userId),
                          dataAdd
                        )
                        .subscribe((e) => {});
                    }
                  });
                }
                // console.log("count",this.count)
                // console.log("apiData.length",apiData.length)
                if (length === 0 && apiData.length<this.count ) {
                  // console.log("HIT2")
                  // for(let i=0;i<apiData.length;i++){
                    // this.chat
                    // .upsetDateData(JSON.stringify(this.userId.userId), dataAdd)
                    // .subscribe((e) => {
                    //   console.log("RES", JSON.stringify(e))
                    //  });
                  // }

                    // count= count+1;&& apiData.length!==count
                }

              });
              this.count= this.count+1;
              });

            //   console.log("fireData.length",fireData.length)
            // apiData.forEach((e) => {
            //   const dataAdd = {
            //     Id: JSON.stringify(e.Id),
            //     Name: e.Name,
            //     unreadCount: "0",
            //     User_Type_Id: JSON.stringify(e.User_Type_Id),
            //     updatedDateTime: new Date().toISOString(),
            //   };
            //   console.log("E>ID",length)
            //   console.log("dataAdd",dataAdd.Id)
            //   if (length !== 0) {
            //     fireData.forEach((t) => {
            //       console.log("E>ID",e)
            //       console.log("T.ID",t)
            //       if (JSON.stringify(e.Id) !== JSON.stringify(t.Id)) {
            //         this.chat
            //           .upsetDateData(
            //             JSON.stringify(this.userId.userId),
            //             dataAdd
            //           )
            //           .subscribe((e) => {});
            //       }
            //     });
            //   }
            //   if (length === 0) {
            //     this.chat
            //       .upsetDateData(JSON.stringify(this.userId.userId), dataAdd)
            //       .subscribe((e) => {
            //         console.log("RES", JSON.stringify(e))
            //       });

            //   }
            // });
          }
        });
    });
  }

  addGroupList() {
    var apiData = [];
    var fireData = [];
    const formData = new FormData();
    formData.append("id", this.userId.userId);
    formData.append("userTypeId", "5");
    return new Promise((resolve, reject) => {
      this.http
        .post(this.url + "/bully-buddy/chat/get_group_chatId", formData)
        .subscribe((res: any) => {
          if (res.status == "200") {
            // console.log("res-> Group", res.result);
            if (res.result) {
              res.result.forEach((e) => {
                if (e.adminId) {
                  apiData.push({ Id: e.adminId, chatId: e.chatId });
                }
                if (e.parentId) {
                  apiData.push({ Id: e.parentId, chatId: e.chatId });
                }
                if (e.studentId) {
                  apiData.push({ Id: e.studentId, chatId: e.chatId });
                }
              });
              // console.log("res-> Group2", apiData);
            }

            this.chat
              .getOneNameById(JSON.stringify(this.userId.userId))
              .subscribe((data) => {
                console.log("list data12", data);
                data.forEach((e) => {
                  fireData.push({
                    Id: e.Id,
                    Name: e.Name,
                    Grade:e.Grade,
                    User_Type_Id: e.User_Type_Id,
                  });
                });
                apiData.forEach((e) => {
                  const dataAdd = {
                    Id: JSON.stringify(e.Id),
                    Name: e.Name,
                    unreadCount: "0",
                    Grade:e.Grade,
                    User_Type_Id: JSON.stringify(e.User_Type_Id),
                    updatedDateTime: new Date().toISOString(),
                  };
                  if (fireData.length !== 0) {
                    fireData.forEach((t) => {
                      if (JSON.stringify(e.Id) != t.Id) {
                        this.chat
                          .upsetDateData(
                            JSON.stringify(this.userId.userId),
                            dataAdd
                          )
                          .subscribe((e) => {});
                      }
                    });
                  }
                  if (fireData.length === 0) {
                    this.chat
                      .upsetDateData(JSON.stringify(this.userId.userId), dataAdd)
                      .subscribe((e) => {});
                  // fireData.forEach((t) => {
                  //   if (JSON.stringify(e.Id) != t.Id) {
                  //     this.chat
                  //       .upsetDateData(
                  //         JSON.stringify(this.userId.userId),
                  //         dataAdd
                  //       )
                  //       .subscribe((e) => {});
                  //   }
                  // });
                  }
                });
              });

            // apiData.forEach((e) => {
            //   const dataAdd = {
            //     Id: JSON.stringify(e.Id),
            //     Name: e.Name,
            //     unreadCount: "0",
            //     User_Type_Id: JSON.stringify(e.User_Type_Id),
            //     updatedDateTime: new Date().toISOString(),
            //   };
            //   if (fireData.length !== 0) {
            //     fireData.forEach((t) => {
            //       if (JSON.stringify(e.Id) != t.Id) {
            //         this.chat
            //           .upsetDateData(
            //             JSON.stringify(this.userId.userId),
            //             dataAdd
            //           )
            //           .subscribe((e) => {});
            //       }
            //     });
            //   }
            //   if (fireData.length === 0) {
            //   //   this.chat
            //   //     .upsetDateData(JSON.stringify(this.userId.userId), dataAdd)
            //   //     .subscribe((e) => {});
            //   fireData.forEach((t) => {
            //     if (JSON.stringify(e.Id) != t.Id) {
            //       this.chat
            //         .upsetDateData(
            //           JSON.stringify(this.userId.userId),
            //           dataAdd
            //         )
            //         .subscribe((e) => {});
            //     }
            //   });
            //   }
            // });
          }
        });
    });
  }

  addCollection() {
    const dataAdd = {
      Id: this.userChatId,
      Name: this.chatName,
      unreadCount: "1",
      updatedDateTime: new Date().toISOString(),
    };
    this.chat
      .upsetDateData(JSON.stringify(this.userId.userId), dataAdd)
      .subscribe((res: any) => {
        // console.log("asa", res);
      });
  }

  onSubmit() {
    this.scrollToBottom();
    this.submitted = true;
    this.messageText = "";
    // stop here if form is invalid
    // var utcMoment = moment.utc();
    const current = new Date();
    const date = moment.utc(current).format();
    // const date = new Date().toISOString();

    // var utcDate = new Date(utcMoment.format());
    // console.log(utcDate);
    // const date = new Date().toISOString();
    // console.log("data", date);
    // console.log("this.messageForm", this.messageForm.value);
    if (this.messageForm.valid) {
      const id = this.formId;
      const data = {
        chatId: this.userChatId,
        // chatId:this.userChatId+"@"+this.ref+"+"+this.userId.userId+"@"+5,
        currentUserId: JSON.stringify(this.userId.userId),
        date: date,
        from: this.formId,
        isRead: "Not",
        text: this.messageForm.value.message,
      };
      const data1 = {
        chatId: this.userChatId,
        currentUserId: JSON.stringify(this.userId.userId),
        currentUserType: "5",
        date: date,
        from: this.formId,
        isRead: "Not",
        text: this.messageForm.value.message,
      };
      this.messageText = this.messageForm.value.message;
      // console.log("asdasdas", data);
      // const c = JSON.parse(this.chatCountNo) + 1;
      if (this.ref == "") {
        this.addCollection();
      } else {
        if (this.apiType == "one") {
          let newCommonChatRoomIdd=this.userChatId+"@"+this.chatUser_Type_Id+"+"+this.userId.userId+"@"+5;
          // this.chat.getChatListData(this.userChatId).subscribe((e: any) => {
            this.chat.getChatListData(this.userChatId).subscribe((e: any) => {
            console.log("Pleasedata",e)
            e.forEach((dd) => {
              // console.log(dd, this.userId.userId, "my id");
              if (dd.Id == this.userId.userId) {
                // console.log("current data", dd);
                const date = moment(new Date()).format();
                const inc = JSON.parse(dd.unreadCount) + 1;
                this.allChatUser = [];
                const data = {
                  Id: JSON.stringify(this.userId.userId),
                  Name: dd.Name,
                  ref: dd.refId,
                  unreadCount: JSON.stringify(inc),
                  updatedDateTime: date,
                };
                // this.newMessage = this.newMessage + dd.unreadCount;
                this.chat
                  .upDateData(this.userChatId, data)
                  .subscribe((data) => {
                    // this.getOneChatUser();
                    // this.getGroupChatUser();
                  });
              }
            });
          });
        } else if (this.apiType == "group") {
          this.group.forEach((g) => {
            if (g !== this.userId.userId) {
              this.chat
                .getChatListData(JSON.stringify(g))
                .subscribe((e: any) => {
                  e.forEach((dd) => {
                    // console.log(
                    //   dd,
                    //   "my group",
                    //   dd.Id,
                    //   this.userChatId,
                    //   dd.refId
                    // );
                    if (dd.Id == this.userChatId) {
                      // console.log("current group", dd);
                      const date = moment(new Date()).format();
                      const inc = JSON.parse(dd.unreadCount) + 1;

                      const data = {
                        Id: JSON.stringify(this.userId.userId),
                        Name: dd.Name,
                        ref: dd.refId,
                        unreadCount: JSON.stringify(inc),
                        updatedDateTime: date,
                      };
                      this.chat
                        .upDateData(JSON.stringify(g), data)
                        .subscribe((data) => {});
                    }
                  });
                });
            }
          });
        }
      }
      this.addChatList(
        this.apiType,
        this.userId.userId,
        this.chatName,
        "0",
        this.ref
      );
      let docId = JSON.parse(localStorage.getItem("doc"));
      // console.log("submit", c, this.chatCountNo, JSON.parse(this.userChatId));
      let newCommonChatRoomIdd=this.userChatId+"@"+this.chatUser_Type_Id+"+"+this.userId.userId+"@"+5;
      if (this.apiType == "one") {
        return new Promise<void>((resolve, reject) => {
          // this.chat.postOneMess(this.userChatId, data).subscribe((res: any) => {
            this.chat.postOneMess(newCommonChatRoomIdd, data).subscribe((res: any) => {
            this.sentMess();
            this.onReset();
            let data1 = JSON.parse(localStorage.getItem("doc"));
            this.getMessage(this.apiType,this.userChatId,this.chatUser_Type_Id);
          });
          resolve();
        });
      } else {
        return new Promise<void>((resolve, reject) => {
          this.chat.postGroupMess(id, data1).subscribe((res: any) => {
            this.sentMess();
            this.onReset();
            let data = JSON.parse(localStorage.getItem("doc"));
            this.getMessage(this.apiType, this.formId,this.userChatId);
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

  public setRow(_index) {debugger;
    this.currentChat = _index;
    this.stopTimer();
    this.stoprefreshTimer();
    this.stoprefreshTimer2();
    this.stopFirebaseTimer();
    this.stopChatCountTimer();
    console.log("indexxxxx",_index)
    this.scrollToBottom();
    this.formId = "";
    this.apiType = "";
    this.userChatId = "";
    this.ref = "";
    this.allChatUser=[];
    this.selectedIndex = _index.index;
    this.show = true;
    this.chatUser_Type_Id = _index.User_Type_Id;
    this.messageForm.setValue({
      message: "",
      chatId: JSON.stringify(_index.chatId),
      from: JSON.stringify(_index.docId),
    });
    let store = {
      type: _index.userType,
      id: JSON.stringify(_index.docId),
      userType:_index.ref,
    };
    localStorage.setItem("doc", JSON.stringify(store));
    // console.log("click formId ", JSON.stringify(_index.docId));
    this.formId = JSON.stringify(_index.docId);
    this.apiType = _index.userType;
    this.group = _index.grp;
    // console.log("as group", _index.grp);
    this.chatName = _index.name;
    this.userChatId = JSON.stringify(_index.chatId);
    this.ref = _index.ref;
    this.chatCountNo = _index.chatCountNo;
    let rowchatcount=JSON.stringify( _index.chatCountNo)
    // console.log(" this.chatCountNo ", JSON.stringify( _index.chatCountNo));
    if(rowchatcount !== '""0""'){
    if(this.newMessage!== 0){
      this.newMessage = this.newMessage - parseInt(this.chatCountNo)
      localStorage.setItem("OneChatcount",this.newMessage.toString());
      if(this.newMessage<0){
        localStorage.setItem("OneChatcount","0");

      }
    }
  }
    // console.log(" this.chatCountNothis.newMessage ", this.newMessage);
    // this.getMessage(_index.userType, JSON.stringify(_index.docId),_index.User_Type_Id);
    this.getMessage(_index.userType, this.userChatId,_index.User_Type_Id);
    // console.log("chatCount", _index.docId);
    this.groupTypeApi(_index.userType, _index.chatId);

    this.addChatList(
      _index.userType,
      this.userId.userId,
      _index.name,
      "0",
      _index.ref
    );
    this.addChatList2(
      _index.userType,
      _index.chatId,
      _index.name,
      "0",
      _index.ref
    );
    this.selectedIndex = 0;
    if(this.newMessage === 0){
      this.stoprefreshTimer()
    }
    this.scrollToBottom();

    this.startTimer();
    // this.getOnechatFirebase();
    // this.getGroupChatFireBase();
    this.starFirebasetTimer();
    this.startChatCountTimer();
  }
getUnreadCount(){
  this.newMessage=0;
  this.allChatUser =[];
  this.getOneChatUser();
  this.getGroupChatUser();
  // this.refresh();
}
startChatCountTimer() {
  this.stopChatCountTimer();
  let data = JSON.parse(localStorage.getItem("doc"));
  this.timer = setInterval(() => {
    // this.allChatUser =[];
    // console.log("startChatCountTimer")
    // this.getMessage(data.type, data.id);
    this.getOneChatUserCount();
    this.getGroupChatUserCount();
  }, 5000);
}
stopChatCountTimer() {
  if (this.timer) {
    clearInterval(this.timer);
  }
}
  startTimer() {
    this.stopTimer();
    let data = JSON.parse(localStorage.getItem("doc"));
    this.timer = setInterval(() => {
      this.allChatUser=[];
      this.getMessage(data.type, data.id,data.userType);
      this.getUnreadCount();
    }, 10000);
  }
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

//to refresh after chat count increased
startrefreshTimer() {
  this.stoprefreshTimer();
  let data = JSON.parse(localStorage.getItem("doc"));
  this.timer = setInterval(() => {
    // this.allChatUser=[];
    if(data.type !== null)
    {this.getMessage(data.type, data.id,data.userType);}
    this.getUnreadCount();
  }, 600);
}
stoprefreshTimer() {
  if (this.timer) {
    clearInterval(this.timer);
  }
}

startrefreshTimer2() {
  this.stoprefreshTimer2();
  let data = JSON.parse(localStorage.getItem("doc"));
  this.timer = setInterval(() => {
    // this.allChatUser=[];
    if(data.type !== null)
    {this.getMessage(data.type, data.id,data.userType);}
    this.getUnreadCount();
  }, 7600);
}
stoprefreshTimer2() {
  if (this.timer) {
    clearInterval(this.timer);
  }
}
  getMessage(userType, docId,chatUserType) {
    let newCommonChatRoomIdd=docId+"@"+chatUserType+"+"+this.userId.userId+"@"+5;
    if (userType == "one") {

      // this.chat.getOneMessageById(docId).subscribe((data) => {
        this.chat.getOneMessageById(newCommonChatRoomIdd).subscribe((data) => {
        console.log("message1", data);
        if (data.length == 0) {
          this.stopTimer();
          localStorage.removeItem("doc");
        }
        this.userMessage = data;
      });
    } else {
      this.chat.getMessageById(docId).subscribe((data) => {
        console.log("message2", data);
        this.userMessage = data;
      });
    }
  }
  addChatList(userType, userChatID, name, unreadCount, ref) {
    const date = moment(new Date()).format();
    // console.log("data", moment(date).format("yyyy-MM-DD hh:mm:ss a zzzz"));

    if (userType == "one") {
      this.allChatUser = [];
      const data = {
        Id: JSON.stringify(this.userId.userId),
        Name: name,
        ref: ref,
        unreadCount: unreadCount,
        updatedDateTime: date,
      };

      this.chat
        .upDateData(JSON.stringify(userChatID), data)
        .subscribe((data) => {
          this.getOneChatUser();
          this.getGroupChatUser();
        });
    } else {
      this.allChatUser = [];
      const data = {
        Id: JSON.stringify(this.userId.userId),
        Name: name,
        ref: ref,
        unreadCount: unreadCount,
        updatedDateTime: date,
      };
      this.chat
        .upDateData(JSON.stringify(userChatID), data)
        .subscribe((data) => {
          this.getOneChatUser();
          this.getGroupChatUser();
        });
    }
  }

  addChatList2(userType, userChatID, name, unreadCount, ref) {
    const date = moment(new Date()).format();
    // console.log("data", moment(date).format("yyyy-MM-DD hh:mm:ss a zzzz"));

    if (userType == "one") {
      // this.allChatUser = [];
      const data = {
        Id: JSON.stringify(this.userId.userId),
        Name: name,
        ref: ref,
        unreadCount: unreadCount,
        updatedDateTime: date,
      };

      this.chat
        .upDateData2(JSON.stringify(userChatID), data)
        .subscribe((data) => {
          // this.getOneChatUser();
          // this.getGroupChatUser();
        });
    } else {
      // this.allChatUser = [];
      const data = {
        Id: JSON.stringify(this.userId.userId),
        Name: name,
        ref: ref,
        unreadCount: unreadCount,
        updatedDateTime: date,
      };
      this.chat
        .upDateData2(JSON.stringify(userChatID), data)
        .subscribe((data) => {
          // this.getOneChatUser();
          // this.getGroupChatUser();
        });
    }
  }

  groupTypeApi(userType, userChatID) {
    if (userType == "one") {
      const formData = new FormData();
      formData.append("userId", userChatID);
      return new Promise<void>((resolve, reject) => {
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
            }
            console.log("this.oneToOneDeviceToken",this.oneToOneDeviceToken)
          });
        resolve();
      });
    } else {
      const formData = new FormData();
      formData.append("chatId", userChatID);
      return new Promise<void>((resolve, reject) => {
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
              res.result.map((element,index) => {

                if(res.result[index].id!==this.userId.userId){
                  this.oneToOneDeviceToken.push({token:element.deviceToken})
                }

                  // token: ,
                  // id: element.id,
                  // userTypeId: element.userTypeId,
                // });
              });
              console.log("this.oneToOneDeviceToken",this.oneToOneDeviceToken);
            }
          });
        resolve();
      });
    }
  }
  starFirebasetTimer() {
    this.stopFirebaseTimer();
    // this.allChatUser =[];
    let data = JSON.parse(localStorage.getItem("doc"));
    this.timer = setInterval(() => {
      this.allChatUser =[];
      this.newMessage =0;
      // this.getMessage(data.type, data.id);
      this.getOnechatFirebase();
      this.getGroupChatFireBase();

    }, 6500);
  }

  //To set FireBase Hit Timmer
  stopFirebaseTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  getOneChatUser() {
    const formData = new FormData();
    formData.append("id", this.userId.userId);
    formData.append("userTypeId", "5");
    let oneChatLength=parseInt(localStorage.getItem("OneChatUserLength"))
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.url + "/bully-buddy/user/get_chat_group_ids", formData)
        .subscribe(
          (res: any) => {
            if (res.status == "200") {
           this.OneChatUser = res.result;
           if(this.OneChatUser.length===0&&(this.GroupChatUser === undefined||this.GroupChatUser.length === 0)){
            this.showNoChat = true;
           }
           else{
            this.showNoChat = false;
           }
          //  console.log("RES.Length", this.OneChatUser)
              // this.starFirebasetTimer();
              this.getOnechatFirebase();
            }
            else{
              this.showNoChat = true;
            }
          },
          (err) => console.log(err)
        );

      resolve();

    });

  }
getOnechatFirebase(){
  this.allChatUser=[];
  let onechat
  this.OneChatUser.forEach((e) => {
    // e.Id
    this.chat
      .getOneNameById(JSON.stringify(this.userId.userId))
      .subscribe((data) => {
        onechat=data;
        console.log("ONeCahtooo",onechat)
        data.forEach((se) => {
          // var ia = JSON.stringify(this.userId.userId);
          var ia = JSON.stringify(e.Id);
          if (se.Id == ia) {
            // console.log("sad2", data, se);
            this.allChatUser.push({
              Id: e.Id,
              Name: e.Name,
              ref: se.refId,
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
              groupParId: null,
              Grade:e.Grade,
              userType: "one",
              chatCount: se.unreadCount,
              chatDate: se.currentDate,
              docId: e.Id + e.User_Type_Id + this.userId.userId + 5,
            });
            // if( se.unreadCount!=="0"){
            //   console.log("coount", se.unreadCount)
            //   let count=0;
            //   count +=parseInt(se.unreadCount);
            //   this.newMessage = count;
            // }


          }
          // this.newMessage = parseInt( this.newMessage +se.unreadCount)

        });

      });
  });
  console.log("onechat",onechat)
  if(onechat.length === 0){
    this.showNoChat = true
  }
  else if(onechat.length !== 0){
    this.showNoChat = false;
  }
   console.log("this.allChatUser",this.allChatUser)
  this.getOneChatUserCount();
  // console.log("ONeCaht",onechat)
  localStorage.setItem("OneChatUserLength",this.OneChatUser.length.toString());
}
  getOneChatUserCount() {
    const formData = new FormData();
    formData.append("id", this.userId.userId);
    formData.append("userTypeId", "5");
    let count=0;
    let i=0;

    let OneChatcount = localStorage.getItem("OneChatcount")
              this.OneChatUser.forEach((e) => {
                // e.Id
                i++;
                this.chat
                  .getOneNameById(JSON.stringify(this.userId.userId))
                  .subscribe((data) => {
                    data.forEach((se) => {
                      // var ia = JSON.stringify(this.userId.userId);
                      this.showNoChat = false;
                      var ia = JSON.stringify(e.Id);
                      if (se.Id == ia) {

                          if( se.unreadCount!=="0"){

                          console.log("coount", se.unreadCount)
                          count +=parseInt(se.unreadCount);
                          this.newMessage = count;

                          if(i===this.OneChatUser.length){
                            // this.refresh();

                            this.playAudio();
                            console.log("this.currentChat",this.currentChat)

                              if(this.currentChat !== "")
                            {this.setRow(this.currentChat)}
                            // this.startChatCountTimer();
                            this.getOnechatFirebase()
                            this.getGroupChatFireBase();
                            this.startrefreshTimer();
                            // this.getUnreadCount();

                            // this.stopChatCountTimer();

                          }

                         }
                        //  else{
                        //   if(i===this.OneChatUser.length){
                        //     this.playAudio();
                        //   }
                        //  }
                          }

                    });

                  //  console.log("OneChatcount",OneChatcount)

                });
                // this.getGroupChatFireBase();
              });

  }

  // getUpdateData() {
  //   this.allChatUser.forEach((e) => {
  //     const Id = JSON.stringify(e.docId);
  //     console.log("getOneMessageById", Id);
  //     if (e.userType == "one") {
  //       var isNotRead = [];
  //       this.chat.getOneMessageById(Id).subscribe((data) => {
  //         console.log("one", data);
  //         data.forEach((e) => {
  //           console.log(" data.forEach", e);
  //           const i = JSON.stringify(this.userId.userId);

  //           if (e.currentUserId !== JSON.stringify(i) && e.isRead == "Not") {
  //             console.log(" data.forEach e", e.currentUserId);
  //             isNotRead.push(e);
  //             console.log(" data.forEach isRead", isNotRead);
  //           }
  //         });

  //         this.allChatUser[e.Id].chatCount = isNotRead.length;
  //         console.log("allChatUser1", this.allChatUser, isNotRead.length);
  //       });
  //     } else {
  //       this.chat.getMessageById(Id).subscribe((data) => {
  //         console.log("group", data);
  //         var isNotRead = [];
  //         data.forEach((e) => {
  //           if (e.currentUserId != JSON.stringify(this.userId.userId)) {
  //             if (e.isRead == "Not") {
  //               isNotRead.push(data);
  //             }
  //           }
  //         });
  //         // const targetIdx = this.allChatUser
  //         //   .map((item) => item.currentUserId)
  //         //   .indexOf(JSON.stringify(this.userId.userId));
  //         // this.allChatUser[targetIdx].chatCount = isNotRead.length;
  //       });
  //     }
  //   });
  // }

  getGroupChatUser() {
    // this.allChatUser=[];
    const formData = new FormData();
    formData.append("id", this.userId.userId);
    formData.append("userTypeId", "5");
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(this.url + "/bully-buddy/chat/get_group_chatId", formData)
        .subscribe(
          (res: any) => {
            if (res.status == "200") {
              this.GroupChatUser = res.result;
              if((this.OneChatUser.length===0||this.OneChatUser === undefined)&&this.GroupChatUser.length === 0){
                this.showNoChat = true;
               }
               else{
                this.showNoChat = false;
               }
              // console.log("res->", res.result);
              this.getGroupChatFireBase();
              // this.starFirebasetTimer();
            }
            else{
              this.showNoChat = false;
             }
          },
          (err) => console.log(err)
        );
      resolve();
    });
  }
  getGroupChatFireBase(){
    this.allChatUser=[]
    let groupChat;
    if (this.GroupChatUser) {
      // this.allChatUser=[]
      this.GroupChatUser.forEach((e) => {
        var count = 0;
        var keyId = JSON.stringify(this.userId.userId);
        // JSON.parse(e.chatId);
        // console.log("groupchat", keyId, e);
        this.chat.getGroupNameById(keyId).subscribe((data) => {
          // this.groupNameData = data;
          // console.log("groupchat list", data);
          groupChat = data;
          data.forEach((s) => {
            if (s.Id == JSON.stringify(e.chatId)) {
              // console.log("s", s);
              this.allChatUser.push({
                Id: e.chatId,
                ref: s.refId,
                Name: s.Name,
                chatGroupType: "GroupChat",
                User_Type_Id: null,
                userImg: "GroupChat2.png",
                adminId: e.adminId,
                parentId: e.parentId,
                studentId: e.studentId,
                groupParId: s.grp,
                userType: "group",
                docId: e.chatId,
                Grade:e.grade,
                chatCount: s.unreadCount,
                chatDate: s.currentDate,
              });
              // if( s.unreadCount!=="0"){
              //   console.log("count",s.unreadCount)
              //   let count=0;
              //   count +=parseInt(s.unreadCount);
              //   this.newMessage = count;
              // }

            }
            console.log("groupchat list", this.allChatUser);
          });
        });
      });
      // this.allChatUser.sort((a, b) => {
      //   if (new Date(a.chatDate) > new Date(b.chatDate)) return 1;
      //   if (new Date(a.chatDate) < new Date(b.chatDate)) return 0;
      //   return 0;
      // });

      // this.getUpdateData();

    }
    this.getGroupChatUserCount();
    localStorage.setItem("GroupChatUserlength",this.GroupChatUser.length.toString());
  }
  getGroupChatUserCount() {
    // this.allChatUser=[]
    const formData = new FormData();
    formData.append("id", this.userId.userId);
    formData.append("userTypeId", "5");
    let count=0;
    let i=0;
    let GroupChatUsercount = localStorage.getItem("GroupChatUsercount")
    // return new Promise((resolve, reject) => {
    //   this.http
    //     .post(this.url + "/bully-buddy/chat/get_group_chatId", formData)
    //     .subscribe(
    //       (res: any) => {
            // if (this.GroupChatUser== "200") {
            //   console.log("res->", res.result);
              if (this.GroupChatUser) {
                this.GroupChatUser.forEach((e) => {
                  // var count = 0;
                  i++;
                  var keyId = JSON.stringify(this.userId.userId);
                  // JSON.parse(e.chatId);
                  // console.log("groupchat", keyId, e);
                  this.chat.getGroupNameById(keyId).subscribe((data) => {
                    // this.groupNameData = data;
                    // console.log("groupchat list", data);
                    data.forEach((s) => {
                      this.showNoChat = false;
                      if (s.Id == JSON.stringify(e.chatId)) {
                        // console.log("s", s);
                        // this.unReadCount.push(e.unreadCount)
                        if( s.unreadCount!=="0"){
                          console.log("GROUPcount",s.unreadCount)

                          count +=parseInt(s.unreadCount);
                          this.newMessage = count;
                          console.log("i", i);
                          console.log("this.GroupChatUser", this.GroupChatUser);
                          if(i===this.GroupChatUser.length){
                            this.playAudio();
                            // this.getUnreadCount();
                              console.log("startrefreshTimer");
                              console.log("this.currentChat",this.currentChat)

                            //   if(this.currentChat !== "")
                            // {this.setRow(this.currentChat)}
                            // this.startChatCountTimer();

                            // this.getGroupChatFireBase();
                            // this.getOnechatFirebase()
                            this.startrefreshTimer2();

                              // this.getGroupChatFireBase();
                              // this.getOnechatFirebase()
                            // this.startrefreshTimer();

                            // this.startChatCountTimer();
                          }
                          // this.stoprefreshTimer2();
                          // this.starFirebasetTimer();
                        }
                      }
                      if(GroupChatUsercount !== count.toString()){
                        localStorage.setItem("GroupChatUsercount",count.toString())
                      }
                      if((parseInt(GroupChatUsercount)<count)&&GroupChatUsercount !== undefined){
                        this.playAudio()
                      }
                    });
                  });
                });
                }
  }

  compare(a, b) {
    return a.chatDate - b.chatDate;
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
        title: this.apiType == "one"?this.userId.name:this.chatName,
        badge: "1",
        sound: "ring.mp3",
      },
      priority: "high",
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        id: this.apiType == "one" ? "1" : "2",
        status: "done",
        chatroomid: this.apiType == "one"?this.userId.userId:this.userChatId,
        chatPersonTypes: this.apiType == "one" ? "5" : "10",
        chatPersonID: this.apiType == "one"?this.userId.userId:this.userChatId,
        allTokens:this.oneToOneDeviceToken,
        personName:this.apiType == "one"?this.userId.name:this.chatName,
        current_Token: ""
      },
    };
    // this.chatName,this.userChatId, this.oneToOneDeviceToken
    console.log("jsonEncode", jsonEncode);
    return new Promise<void>((resolve, reject) => {
      this.http
        .post("https://fcm.googleapis.com/fcm/send", jsonEncode, httpOptions)
        .subscribe((res: any) => {
          // console.log("successMessage", res);
        });
      resolve();
    });
  }
}
