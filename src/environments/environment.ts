// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCQ4DyHR3OxRm9g7M2AZF7PIpQYpsSSfsM",
    authDomain: "tellevoapp-efcd2.firebaseapp.com",
    projectId: "tellevoapp-efcd2",
    storageBucket: "tellevoapp-efcd2.appspot.com",
    messagingSenderId: "874102776496",
    appId: "1:874102776496:web:0a52c85bd8730e5d131175",
    measurementId: "G-PLYL9XJN3P"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
