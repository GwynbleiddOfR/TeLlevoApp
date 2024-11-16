import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavigationExtras, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-lista-viajes',
  templateUrl: './lista-viajes.page.html',
  styleUrls: ['./lista-viajes.page.scss'],
})
export class ListaViajesPage implements OnInit {
  viajes: any[] = [];

  constructor(private router: Router) { }
  firebaseSvc = inject(FirebaseService);
  utils = inject(UtilsService);

  ngOnInit() {
    this.obtenerViajes();
  }

  async ionViewWillEnter() {
    // Recargar los datos al volver a la vista
    await this.obtenerViajes();
  }

  async obtenerViajes() {
    const loading = await this.utils.loading();
    loading.present();

    try {
      const querySnapshot = await this.firebaseSvc.firestore.collection('viajes').get().toPromise();

      this.viajes = []; // Reinicia el array en cada carga

      querySnapshot.forEach((doc) => {
        // Guarda cada documento en el array `viajes`
        const data = doc.data();
        if (data && typeof data === 'object') {
          this.viajes.push({ id: doc.id, ...data });
        }
      });
    } catch (error) {
      console.error("Error al obtener los viajes:", error);
    } finally {
      loading.dismiss();  // Asegúrate de que el loading se cierra independientemente del resultado
    }
  }

  async verViaje(id: string) {
    const loading = await this.utils.loading(); // Mostrar loading al navegar
    loading.present();

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
