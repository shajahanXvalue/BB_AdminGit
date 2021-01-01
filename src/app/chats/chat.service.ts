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
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.ref = firebase.firestore().collection("testMessages");
    this.groupRef = firebase.firestore().collection("group_chat");
    this.groupNameRef = firebase.firestore().collection("chat_list_table");
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
  getGroupNameById(id: string): Observable<any> {
    return new Observable((observer) => {
      this.groupNameRef
        .doc(id)
        .collection("chat_list")
        .get()
        .then((doc) => {
          let data = [];
          doc.docs.forEach((doc) => {
            // console.log("GN", doc.data());
            data.push({
              Id: doc.data().Id,
              Name: doc.data().Name,
              User_Type_Id: doc.data().User_Type_Id,
              unreadCount: doc.data().unreadCount,
            });
          });
          observer.next(data);
        })
        .catch((err) => console.log("Please try again"));
    });
  }

  getMessageById(id: string): Observable<any> {
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
            });
          });
          observer.next(data);
        })
        .catch((err) => console.log("Please try again"));
    });
  }

  getOneMessageById(id: string): Observable<any> {
    return new Observable((observer) => {
      this.ref
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
            });
          });
          observer.next(data);
        })
        .catch((err) => console.log("Please try again"));
    });
  }

  postOneMess(id, data): Observable<any> {
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
