import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-lista-viajes',
  templateUrl: './lista-viajes.page.html',
  styleUrls: ['./lista-viajes.page.scss'],
})
export class ListaViajesPage implements OnInit {
  viajes: any[] = [];
  constructor(private router: Router) { }
  firebaseSvc = inject(FirebaseService)
  utils = inject(UtilsService)
  ngOnInit() {
    this.obtenerViajes();
  }
  async obtenerViajes(){
    const loading = await this.utils.loading();
    loading.present();
    this.firebaseSvc.firestore.collection('viajes').get().subscribe((querySnapshot) => {
      this.viajes = []; // Reinicia el array en cada carga
      querySnapshot.forEach((doc) => {
        // Guarda cada documento en el array `viajes`
        const data = doc.data();
        if (data && typeof data === 'object') {
          this.viajes.push({ id: doc.id, ...data });
        }
      });
      loading.dismiss()
    });
  }
}

