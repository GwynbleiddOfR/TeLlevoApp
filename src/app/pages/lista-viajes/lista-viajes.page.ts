import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-lista-viajes',
  templateUrl: './lista-viajes.page.html',
  styleUrls: ['./lista-viajes.page.scss'],
})
export class ListaViajesPage implements OnInit {
  viajes: any[] = [];
  constructor(private router:Router) { }
  firebaseSvc = inject(FirebaseService)
  ngOnInit() {
    this.obtenerViajes();
  }
  obtenerViajes(): void {
    this.firebaseSvc.firestore.collection('viajes').get().subscribe((querySnapshot) => {
      this.viajes = []; // Reinicia el array en cada carga
      querySnapshot.forEach((doc) => {
        // Guarda cada documento en el array `viajes`
        const data = doc.data();
        if (data && typeof data === 'object') {
          this.viajes.push({ id: doc.id, ...data });
        }
      });
      console.log(this.viajes); // Verifica que los datos se hayan guardado correctamente
    });
  }
  verViaje(id: string) {
    let xtras: NavigationExtras = {
      state: {
        id: id
      }
    }
    this.router.navigate(['confirmacion'], xtras);
  }
}

