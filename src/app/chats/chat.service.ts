import { Injectable } from "@angular/core";
// import core firebase client (required)
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as firebase from "firebase";
import "firebase/firestore";

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

@Injectable({
  providedIn: "root",
})
export class ChatService {
  ref;
  groupRef;
  groupNameRef;
  groupNameupdateRef;
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.ref = firebase.firestore().collection("testMessages");
    this.groupRef = firebase.firestore().collection("group_chat");
    this.groupNameRef = firebase.firestore().collection("chat_list_table");
    this.groupNameupdateRef = firebase.firestore().collection("USERS_REFRESH");
  }

  getAllMessage(): Observable<any> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        let boards = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
        });
        observer.next();
      });
    });
  }
  getOneNameById(id: string): Observable<any> {
    return new Observable((observer) => {
      this.groupNameRef
        .doc(id)
        .collection("chat_list")
        .orderBy("updatedDateTime", "asc")
        .get()
        .then((doc) => {
          let data = [];
          doc.docs.forEach((doc) => {
            data.push({
              Id: doc.data().Id,
              refId: doc.ref.id,
              Name: doc.data().Name,
              User_Type_Id: doc.data().User_Type_Id,
              unreadCount: doc.data().unreadCount,
              currentDate: doc.data().updatedDateTime,
            });
            // console.log("GN", doc.data(), doc.ref.id);
          });
          observer.next(data);
          console.log("GN", data)
        })
        .catch((err) => console.log("Please try again"));
    });
  }
  getGroupNameById(id: string): Observable<any> {
    return new Observable((observer) => {
      this.groupNameRef
        .doc(id)
        .collection("chat_list")
        .orderBy("updatedDateTime", "asc")
        .get()
        .then((doc) => {
          let data = [];
          doc.docs.forEach((doc) => {
            // console.log("GN", doc.data());
            data.push({
              Id: doc.data().Id,
              refId: doc.ref.id,
              Name: doc.data().Name,
              User_Type_Id: doc.data().User_Type_Id,
              unreadCount: doc.data().unreadCount,
              currentDate: doc.data().updatedDateTime,
              grp: doc.data().grp_per_ID,
            });
          });
          observer.next(data);
        })
        .catch((err) => console.log("Please try again"));
    });
  }

  // update
  upDateData(id: string, data): Observable<any> {
    console.log("upDate", id, data, data.ref, data.unreadCount);
    return new Observable((observer) => {
      this.groupNameRef
        .doc(id)
        .collection("chat_list")
        .doc(data.ref)
        .update({
          unreadCount: data.unreadCount,
          updatedDateTime: data.updatedDateTime,
        })
        .then(() => {
          observer.next();
        })
        .catch((err) => console.log("Please try again"));
    });
  }

  upDateData2(id: string, data): Observable<any> {
    console.log("upDate", id, data, data.ref, data.unreadCount);
    return new Observable((observer) => {
      this.groupNameRef
        .doc(id)
        .collection("chat_list")
        .doc(data.ref)
        .update({
          updatedDateTime: data.updatedDateTime,
        })
        .then(() => {
          observer.next();
        })
        .catch((err) => console.log("Please try again"));
    });
  }

  upsetDateData(id: string, data): Observable<any> {
    console.log("upDate", id, data);
    return new Observable((observer) => {
      this.groupNameRef
        .doc(id)
        .collection("chat_list")
        .doc()
        .set(data)
        .then(() => {
          observer.next();
        })
        .catch((err) => console.log("Please try again"));
    });
  }

  getChatListData(id: string): Observable<any> {
    return new Observable((observer) => {
      this.groupNameRef
        .doc(id)
        .collection("chat_list")
        .get()
        .then((doc) => {
          let data = [];
          doc.docs.forEach((doc) => {
            data.push({
              Id: doc.data().Id,
              refId: doc.ref.id,
              Name: doc.data().Name,
              User_Type_Id: doc.data().User_Type_Id,
              unreadCount: doc.data().unreadCount,
              currentDate: doc.data().updatedDateTime,
            });
          });

          observer.next(data);
          console.log("Pleasedata",data)
        })
        .catch((err) => console.log("Please try again"));
    });
  }
  getChatListDataUpdate(id: string){
    this.groupNameupdateRef.doc(id).get().then(function(doc) {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          // this.setChatListDataUpdate(id)
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });

  }
  setChatListDataUpdate(id:string){

    this.groupNameupdateRef.doc(id).set({refresh:false});
      // if (doc.exists) {
      //     console.log("Document data:", doc.data());
      // } else {
      //     // doc.data() will be undefined in this case
      //     console.log("No such document!");
      // }



  }
  getMessageById(id: string): Observable<any> {
    debugger;
    return new Observable((observer) => {
      this.groupRef
        .doc(id)
        .collection("msg")
        .orderBy("date", "asc")
        .get()
        .then((doc) => {
          let data = [];
          doc.docs.forEach((doc) => {
            data.push({
              chatId: doc.data().chatId,
              currentUserId: doc.data().currentUserId,
              date: doc.data().date,
              from: doc.data().from,
              isRead: doc.data().isRead,
              text: doc.data().text,
              currentUserType: doc.data().currentUserType
            });
          });
          observer.next(data);
        })
        .catch((err) => console.log("Please try again"));
    });
  }
  // newCommonChatRoomIdd=chatPersonUserId+"@"+chatPersonUserType+
  //               "+"+currentUserIdd+"@"+currentUserType;

  getOneMessageById(id:string): Observable<any> {
    return new Observable((observer) => {
      this.ref
        .doc(id)
        .collection("msg")
        .orderBy("date", "asc")
        .get()
        .then((doc) => {
          // console.log("doc",doc);
          let data = [];
          doc.docs.forEach((doc) => {
            console.log("doc.data",doc.data());
            data.push({
              chatId: doc.data().chatId,
              currentUserId: doc.data().currentUserId,
              date: doc.data().date,
              from: doc.data().from,
              isRead: doc.data().isRead,
              text: doc.data().text,
              currentUserType: doc.data().currentUserType
            });
          });
          observer.next(data);
          console.log("doc.data",data);
        })
        .catch((err) => console.log("Please try again", err));
    });
  }

  postOneMess(id:string, data): Observable<any> {
    // console.log("postOneMess", id);
    return new Observable((observer) => {
      this.ref
        .doc(id)
        .collection("msg")
        .add(data)
        .then(() => {
          observer.next();
        });
    });
  }
  postTableMess(id, data): Observable<any> {
    // console.log("postOneMess", id);
    return new Observable((observer) => {
      this.groupNameRef
        .doc(id)
        .collection("chat_list")
        .add(data)
        .then(() => {
          observer.next();
        });
    });
  }

  postGroupMess(id, data): Observable<any> {
    return new Observable((observer) => {
      this.groupRef
        .doc(id)
        .collection("msg")
        .add(data)
        .then((doc) => {
          observer.next();
        });
    });
  }
}
