import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MenuController } from '@ionic/angular'
import { NotificacionesService } from './services/notificaciones.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private location: Location, private router: Router, private menuCtrl: MenuController, private notificaciones: NotificacionesService) {
    this.initializeNotifications();
  }
  private initializeNotifications() {
    this.notificaciones.initPushNotifications();
  }
  navigateTo(route: string) {
    this.router.navigate([route]);
    this.menuCtrl.close();
  }

  cerrarSesion() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/inicio-sesion']);
    this.menuCtrl.close();
  }

  volverAtras() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/perfil-usuario']);
    }
  }

  isIniciarSesionPage(): boolean {
    return this.router.url === '/inicio-sesion' || this.router.url === '/registro';  // Retorna true si la ruta es /login

  }
}