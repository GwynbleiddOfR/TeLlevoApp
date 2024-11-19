import { Component, OnInit, inject } from '@angular/core';
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
  constructor() { }

  ngOnInit() {
    this.noti.requestPermission();
  }

  saveToken() {
    const token = this.noti.getToken();
    const user = this.utils.getFromlocalStorage('user');
    console.log('token', token);
    this.firebase.updateDocument(`users/${user.uid}`, { 'token': token });
  }

}
