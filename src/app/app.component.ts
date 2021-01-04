import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { NotifierService } from 'angular-notifier';
import * as firebase from "firebase/app";
import "firebase/firestore";
import { ChatService } from "../app/chats/chat.service";
@Component({
  // tslint:disable-next-line
  selector: "body",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnInit {
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
  url = "https://bullyingbuddyapp.com/java-service-admin";
  constructor(private router: Router, private http: HttpClient,private chat: ChatService,private notifier: NotifierService) {}

  ngOnInit() {
    console.log("this.userId.userId",this.userId.userId)
    if(this.userId.userId !== 0){
      this.getOneChatUser();
      this.getGroupChatUser();
      // this.addChatListData();
      this.addChatListFireBase()
    }

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  get sortData(){
    console.log("allChatUserallChatUser",this.allChatUser);
    return this.allChatUser;
  }

  playAudio(){
    let OneChatcount= localStorage.getItem("OneChatcount")
    // console.log("APPthis.newMessage",this.newMessage);
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
  starFirebasetTimer() {

    this.stopFirebaseTimer();
    // this.allChatUser =[];
    let data = JSON.parse(localStorage.getItem("doc"));
    this.timer = setInterval(() => {
      this.allChatUser =[];
      this.newMessage =0;
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
  getUnreadCount(){
    this.newMessage=0;
    this.allChatUser =[];
    this.getOneChatUser();
    this.getGroupChatUser();
    // this.refresh();
  }

  //to refresh after chat count increased
startrefreshTimer() {
  this.stoprefreshTimer();
  let data = JSON.parse(localStorage.getItem("doc"));
  this.timer = setInterval(() => {
    this.allChatUser=[];
    // this.getMessage(data.type, data.id);
    this.getUnreadCount();
  }, 5000);
}
stoprefreshTimer() {
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
              this.starFirebasetTimer();
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
  let onechat;
  this.OneChatUser.forEach((e) => {
    // e.Id
    this.chat
      .getOneNameById(JSON.stringify(this.userId.userId))
      .subscribe((data) => {
       onechat = data;
        data.forEach((se) => {
          // var ia = JSON.stringify(this.userId.userId);
          var ia = JSON.stringify(e.Id);
          if (se.Id == ia) {
            // console.log("sad2", data, se);
            this.allChatUser.push({
              Id: e.Id.toString(),
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
            this.getOneChatUserCount();
          }
          // this.newMessage = parseInt( this.newMessage +se.unreadCount)

        });

      });

  });
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
                      var ia = JSON.stringify(e.Id);
                      if (se.Id == ia) {
                        // console.log("compare",JSON.stringify(e) )

                          if( se.unreadCount!=="0"){

                          // console.log("coount", se.unreadCount)
                          count +=parseInt(se.unreadCount);
                          this.newMessage = count;
                          if(i===this.OneChatUser.length){
                            this.playAudio();
                            this.startrefreshTimer()
                          }
                         }
                        //  else{
                        //   if(i===this.OneChatUser.length){
                        //     this.playAudio();
                        //   }
                        //  }
                          }
                          else{
                            // console.log("compare 2",JSON.stringify(se))
                            // console.log("this.OneChatUser",this.OneChatUser[6])
                          }
                    });



                });

              });
              // console.log("OneChatcount",OneChatcount)
  }
  getGroupChatUser() {
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
              this.starFirebasetTimer();
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
    if (this.GroupChatUser) {
      this.GroupChatUser.forEach((e) => {
        var count = 0;
        var keyId = JSON.stringify(this.userId.userId);
        // JSON.parse(e.chatId);
        // console.log("groupchat", keyId, e);
        this.chat.getGroupNameById(keyId).subscribe((data) => {
          // this.groupNameData = data;
          // console.log("groupchat list", data);
          data.forEach((s) => {
            if (s.Id == JSON.stringify(e.chatId)) {
              // console.log("s", s);
              let chatId = e.chatId.toString()
              this.allChatUser.push({
                Id: chatId,
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
              this.getGroupChatUserCount();
            }

          });
        });
      });
      // this.allChatUser.sort((a, b) => {
      //   if (new Date(a.chatDate) > new Date(b.chatDate)) return 1;
      //   if (new Date(a.chatDate) < new Date(b.chatDate)) return 0;
      //   return 0;
      // });

      // this.getUpdateData();
      localStorage.setItem("GroupChatUserlength",this.GroupChatUser.length.toString());

    }
  }
  getGroupChatUserCount() {
    const formData = new FormData();
    formData.append("id", this.userId.userId);
    formData.append("userTypeId", "5");
    let count=0;
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
                  var count = 0;
                  var keyId = JSON.stringify(this.userId.userId);
                  // JSON.parse(e.chatId);
                  // console.log("groupchat", keyId, e);
                  this.chat.getGroupNameById(keyId).subscribe((data) => {
                    // this.groupNameData = data;
                    // console.log("groupchat list", data);
                    data.forEach((s) => {
                      if (s.Id == JSON.stringify(e.chatId)) {
                        // console.log("s", s);
                        // this.unReadCount.push(e.unreadCount)
                        if( s.unreadCount!=="0"){
                          // console.log("count",s.unreadCount)

                          count +=parseInt(s.unreadCount);
                          this.newMessage = count;
                          this.playAudio();
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


addChatListFireBase(){

  let fireBase;
  this.chat
  .getOneNameById(JSON.stringify(this.userId.userId))
  .subscribe((data) => {
    // console.log("FBDATA",data)
    // console.log("localData",this.OneChatUser)
    // data.forEach(element => {
    //   let fbID = element.Id.toString();
    //   this.OneChatUser.forEach(ele=>{
    //     let localID = ele.Id.toString();
    //     if(fbID != localID){
    //       console.log("ele",ele);
    //     }
    //   })

    // });
  });
  // this.chat
  // .getChatListDataUpdate(JSON.stringify(this.userId.userId))
  // .subscribe((res: any) => {
  //   console.log("asa", res);
  // });

  // this.chat.setChatListDataUpdate(JSON.stringify(this.userId.userId))
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
                // console.log("list data1", data);
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
                // console.log("E>ID",length)
                // console.log("dataAdd",dataAdd)
                // console.log("fireData",fireData)
                // if (length !== 0 && apiData.length===length) {
                  fireData.forEach((t) => {
                    // console.log("E>ID",res.Id)
                    // console.log("T.ID",t.Id)
                    // let eId=JSON.stringify(res.Id);
                    let eId = res.Id.toString();
                    let tId =t.Id.toString();
                    // tId= tId.toString();
                    if (eId !== tId) {
                      // console.log("HIT")
                    //   this.chat
                    //     .upsetDateData(
                    //       JSON.stringify(this.userId.userId),
                    //       dataAdd
                    //     )
                    //     .subscribe((e) => {});
                    let fildata = res
                    // console.log("datafireup",fildata)
                    }
                  });
                // }
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
}
