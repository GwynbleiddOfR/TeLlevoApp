import { Component, OnInit, inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebase = inject(FirebaseService);
  noti = inject(NotificacionesService);
  utils = inject(UtilsService);
  constructor(private platform: Platform) { }

  ngOnInit() {
    if (this.platform.is('capacitor')) {
      this.noti.requestPermission();
      this.saveToken();
      this.noti.getDeliveredNotifications();
    }
  }

  async saveToken() {
    try {
      const token = await this.noti.getToken();
      const user = this.utils.getFromlocalStorage('user');
      console.log('token', token);
      this.firebase.updateDocument(`users/${user.uid}`, { 'token': token });
    } catch (error) {
      console.error('Error getting token', error);
    }
  }
}
