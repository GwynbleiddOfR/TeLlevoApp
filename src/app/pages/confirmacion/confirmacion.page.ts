import { Component, OnInit, inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.page.html',
  styleUrls: ['./confirmacion.page.scss'],
})
export class ConfirmacionPage implements OnInit {
  viaje: any;
  id: any;
  conductor: any;
  vehiculo: any;
  reservado: boolean = false; // Estado de la reserva

  constructor(private router: Router) { }
  firebaseSvc = inject(FirebaseService);
  utils = inject(UtilsService);

  async ngOnInit() {
    await this.cargarDatos();
  }

  async ionViewWillEnter() {
    await this.cargarDatos(); // Recargar datos al volver a la vista
  }

  async cargarDatos() {
    let xtras = this.router.getCurrentNavigation()?.extras.state;
    if (xtras !== undefined) {
      this.id = xtras["id"];
      await this.utils.presentLoading(); // Mostrar loading al iniciar

      try {
        this.conductor = await this.firebaseSvc.getDocument('users/' + this.id);
        this.firebaseSvc.obtenerVehiculoPorUserId(this.id).subscribe((vehiculos) => {
          this.vehiculo = vehiculos[0];
        });

        const path = `viajes/${this.id}`;
        this.viaje = await this.firebaseSvc.getDocument(path);
        await this.checkReserva(); // Verificar reserva al cargar el viaje
      } catch (error) {
        console.error("Error getting document:", error);
      } finally {
        await this.utils.dismissLoading(); // Ocultar loading
      }
    }
  }

  async checkReserva() {
    const userId = (await this.firebaseSvc.getCurrentUser()).uid;
    try {
      const reservaDoc = await this.firebaseSvc.getDocument(`users/${userId}/reservas/${this.id}`);
      // Verifica si el documento de reserva existe
      this.reservado = reservaDoc !== undefined; // Actualiza el estado de reservado
    } catch (error) {
      console.error("Error al verificar la reserva:", error);
    }
  }

  async confirmar() {
    const user = await this.firebaseSvc.getCurrentUser();
    const userId = user.uid; // Asegúrate de obtener el ID del usuario correctamente
    // Verifica si el usuario es el conductor del viaje
    if (this.conductor && this.conductor.uid === userId) {
      this.utils.presentToast({
        message: "No puedes reservar tu propio viaje",
        duration: 5000,
        color: 'primary',
        position: 'top',
        icon: 'alert-circle-outline'
      });
      return; // Detén la ejecución si el usuario es el conductor
    }

    if (this.viaje && this.viaje.asientos !== undefined && this.viaje.asientos > 0) {
      const path = `viajes/${this.id}`;
      const updatedAsientos = this.viaje.asientos - 1;
      const reserva = {
        userId: userId,
        viajeId: this.id,
        fechaReserva: new Date().toISOString(),
      };

      await this.utils.presentLoading(); // Mostrar loading al confirmar

      try {
        // Actualiza el documento Firestore para los asientos disponibles
        await this.firebaseSvc.updateDocument(path, { asientos: updatedAsientos });
        await this.firebaseSvc.setDocument(`users/${userId}/reservas/${this.id}`, reserva); // Cambia aquí

        this.reservado = true; // Actualiza el estado de reservado
        this.utils.presentToast({
          message: "Reserva exitosa",
          duration: 5000,
          color: 'primary',
          position: 'top',
          icon: 'alert-circle-outline'
        });
        this.verMapa(this.id);
      } catch (error) {
        console.error("Error updating document:", error);
      } finally {
        await this.utils.dismissLoading(); // Ocultar loading
      }
    } else {
      console.error("Invalid 'viaje' data or no seats available to decrement.");
    }
  }

  async cancelarReserva() {
    const userId = (await this.firebaseSvc.getCurrentUser()).uid;
    const viajeId = this.id;
    const path = `viajes/${viajeId}`;

    await this.utils.presentLoading(); // Mostrar loading al cancelar reserva

    try {
      const currentAsientos = this.viaje.asientos;
      const updatedAsientos = currentAsientos + 1;

      await this.firebaseSvc.deleteDocument(`/users/${userId}/reservas/${viajeId}`);
      await this.firebaseSvc.updateDocument(path, { asientos: updatedAsientos });
      this.reservado = false; // Actualiza el estado de reservado
      this.utils.presentToast({
        message: "Reserva cancelada",
        duration: 5000,
        color: 'primary',
        position: 'top',
        icon: 'alert-circle-outline'
      });
      this.router.navigate(["/home"]);
    } catch (error) {
      console.error("Error cancelando reserva:", error);
    } finally {
      await this.utils.dismissLoading(); // Ocultar loading
    }
  }

  verMapa(id: string) {
    let xtras: NavigationExtras = {
      state: {
        id: id
      }
    };
    this.router.navigate(['/map'], xtras);
  }
}