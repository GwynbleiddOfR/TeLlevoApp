import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavigationExtras, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { Network } from '@capacitor/network';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-lista-viajes',
  templateUrl: './lista-viajes.page.html',
  styleUrls: ['./lista-viajes.page.scss'],
})
export class ListaViajesPage implements OnInit {
  viajes: any[] = [];

  constructor(private router: Router, private platform: Platform) { }
  firebaseSvc = inject(FirebaseService);
  utils = inject(UtilsService);

  ngOnInit() {
    if (this.checkNetwork) {
      this.obtenerViajes();
    }
    else {
      this.sinInternet();
    }
  }

  ionViewWillEnter() {
    // Recargar los datos al volver a la vista
    if (this.checkNetwork) {
      this.obtenerViajes();
    } else {
      this.sinInternet();
    }
  }
  async checkNetwork() {
    return (await Network.getStatus()).connected;
  }
  sinInternet() {
    this.viajes = this.utils.getFromlocalStorage('viaje');
  }
  async obtenerViajes() {
    const loading = await this.utils.loading();
    loading.present();

    try {
      this.firebaseSvc.realtime
        .list('viajes')
        .snapshotChanges() // Listen to the real-time changes
        .subscribe((querySnapshot) => {
          this.viajes = []; // Reinicia el array en cada carga
          querySnapshot.forEach((action) => {
            const key = action.key; // Get the unique key of each node
            const data = action.payload.val(); // Retrieve the value (data)

            if (data && typeof data === 'object') {
              this.viajes.push({ id: key, ...data });
            }
          });
        });
    } catch (error) {
      console.error('Error al obtener los viajes:', error);
      this.viajes = this.utils.getFromlocalStorage('viaje');
    } finally {
      loading.dismiss(); // Asegúrate de que el loading se cierra independientemente del resultado
    }
  }

  async verViaje(id: string) {
    const loading = await this.utils.loading(); // Mostrar loading al navegar
    loading.present();
    console.log(id);

    let xtras: NavigationExtras = {
      state: {
        id: id
      }
    };

    // Usar el objeto `xtras` dentro de `navigate`
    this.router.navigate(['confirmacion'], xtras).then(() => {
      loading.dismiss(); // Ocultar loading después de la navegación
    }).catch(() => {
      loading.dismiss(); // Asegúrate de ocultar el loading en caso de error
    });
  }

  // Método para ir al chat
  irAlChat(viajeId: string) {
    this.router.navigate(['chat', { id: viajeId }]); // Navegar al chat con el ID del viaje
  }
}
