import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
  apiKey: "AIzaSyDDxhu3rKP-xSLOgmidC_fKYQ-u6Aee2zI",
  authDomain: "vuechatroom-b8368.firebaseapp.com",
  databaseURL: "https://vuechatroom-b8368.firebaseio.com",
  projectId: "vuechatroom-b8368",
  storageBucket: "vuechatroom-b8368.appspot.com",
  messagingSenderId: "908937200350",
  appId: "1:908937200350:web:83c3b9b2fb2e664f85784f"
};
firebase.initializeApp(config);

export const auth = firebase.auth();
export const db = firebase.database();
export const storage = firebase.storage();