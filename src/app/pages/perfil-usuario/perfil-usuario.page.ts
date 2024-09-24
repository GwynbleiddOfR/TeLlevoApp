import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {

  usuario = {
    nombre: 'Simon',
    apellido: 'Muñoz',
    email: 'simon.munoz@gmail.com',
    telefono: '123456789',
    rol: 'conductor',
  };

  constructor(private router: Router) { }

  ngOnInit() {}

  verHistorial() {
    console.log('Accediendo al historial de viajes...');
    this.router.navigate(['/historial-viajes']);
  }

  editarInformacion() {
    console.log('Accediendo a la edición de información personal y del vehículo...');
    this.router.navigate(['/registro-usuario']);
  }
}