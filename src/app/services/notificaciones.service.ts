import { Injectable } from '@angular/core';
import { getMessaging, getToken } from "firebase/messaging";
@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: "BIorr5Nw9nV44let7pX4tJGhy7xvwctGbBuSYHhP1dvpELQ22v13R0B7DvA86rIcAwxiPsJYlo4qYAplYR-hUXI" });
  }
  requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    })
  }
}
