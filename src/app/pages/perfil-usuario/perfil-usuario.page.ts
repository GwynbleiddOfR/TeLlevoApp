import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {

  userData: any;
  vehiculoData: any;

  constructor(private router: Router) { }

  firebaseSvc = inject(FirebaseService);
  utils = inject(UtilsService);

  ngOnInit() {
    this.obtenerDatosUsuario();
  }

  async obtenerDatosUsuario() {
    const loading = await this.utils.loading(); // Mostrar loading
    loading.present();
    try {
      const user = await this.firebaseSvc.auth.currentUser;
      if (user) {
        const path = `users/${user.uid}`;
        console.log(user.uid);
        this.userData = await this.firebaseSvc.getDocument(path);
        this.firebaseSvc.obtenerVehiculoPorUserId(user.uid).subscribe((vehiculos) => {
          this.vehiculoData = vehiculos[0];
        });
        console.log(this.vehiculoData);
      } else {
        console.warn("No user is currently logged in.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      loading.dismiss(); // Ocultar loading al finalizar
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
