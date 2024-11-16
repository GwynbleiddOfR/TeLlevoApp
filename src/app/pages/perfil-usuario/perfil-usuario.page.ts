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
  obtenerDatosUsuario() {
    this.userData = this.utils.getFromlocalStorage('user')
    console.log(this.userData)
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
