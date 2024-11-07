import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {

  usuario = {
    nombre: 'Simón',
    apellido: 'Muñoz',
    email: 'biorka_vuelve-xfa@duocuc.cl',
    vehiculo: 'No aplica',
  };

  constructor(private router: Router) { }
  firebaseSvc = inject(FirebaseService)
  async ngOnInit() {
    try {
      const user = await this.firebaseSvc.auth.currentUser;
      if (user) {
        const path = "users/" + user.uid;
        const data = await this.firebaseSvc.getDocument(path); // Await the async call
        console.log(data); // Now it logs the actual data, not a Promise
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  verHistorial() {
    console.log('Accediendo al historial de viajes...');
    this.router.navigate(['/historial-viajes']);
  }

  editarInformacion() {
    console.log('Accediendo a la edición de información personal y del vehículo...');
    this.router.navigate(['/registro-usuario']);
  }
}