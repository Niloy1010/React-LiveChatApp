import firebase from 'firebase/app';

import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDy8jb0pog_AMVvr3agPKBTVUYGhpcDdX4",
    authDomain: "react-livechatapp.firebaseapp.com",
    databaseURL: "https://react-livechatapp.firebaseio.com",
    projectId: "react-livechatapp",
    storageBucket: "react-livechatapp.appspot.com",
    messagingSenderId: "607558733477",
    appId: "1:607558733477:web:73eeb63d0d75328eb2074c",
    measurementId: "G-Q4CS926SD9"
  };
  firebase.initializeApp(firebaseConfig);

  export default firebase;