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
  ngOnInit() {
    let xtras = this.router.getCurrentNavigation()?.extras.state;
    if (xtras !== undefined) {
      this.id = xtras["id"];

      this.firebaseSvc.getDocument('users/' + this.id).then((doc) => {
        this.conductor = doc;
      });

      this.firebaseSvc.obtenerVehiculoPorUserId(this.id).subscribe((vehiculos) => {
        this.vehiculo = vehiculos[0];
      });

      const path = `viajes/${this.id}`; // Asegúrate de que este ID sea correcto
      this.firebaseSvc.getDocument(path).then((doc) => {
        this.viaje = doc;
        this.checkReserva(); // Verificar reserva al cargar el viaje
      }).catch((error) => {
        console.error("Error getting document:", error);
      });
    }
  }

  async checkReserva() {
    const userId = (await this.firebaseSvc.getCurrentUser()).uid;
    try {
      const reservaDoc = await this.firebaseSvc.getDocument(`users/${userId}/reservas/${this.id}`);
      // Verifica si el documento de reserva existe
      if (reservaDoc !== undefined) {
        this.reservado = true; // Actualiza el estado de reservado
      } else {
        this.reservado = false; // No hay reserva
      }
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

      })
      return; // Detén la ejecución si el usuario es el conductor
    }
    // Asegúrate de que esto sea await
    if (this.viaje && this.viaje.asientos !== undefined && this.viaje.asientos > 0) {
      const path = `viajes/${this.id}`; // Usa this.id en lugar de this.viaje.id
      const updatedAsientos = this.viaje.asientos - 1;
      const reserva = {
        userId: userId,
        viajeId: this.id, // Usa this.id aquí también
        fechaReserva: new Date().toISOString(),
      };
      try {
        // Actualiza el documento Firestore para los asientos disponibles
        await this.firebaseSvc.updateDocument(path, { asientos: updatedAsientos });

        // Asegúrate de que la ruta de reserva esté correcta
        await this.firebaseSvc.setDocument(`users/${userId}/reservas/${this.id}`, reserva); // Cambia aquí

        this.reservado = true; // Actualiza el estado de reservado
        this.utils.presentToast({
          message: "Reserva exitosa",
          duration: 5000,
          color: 'primary',
          position: 'top',
          icon: 'alert-circle-outline'

        })
        let xtras: NavigationExtras = {
          state: {
            id: this.id
          }
        };
        this.router.navigate(["/map"], xtras);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    } else {
      console.error("Invalid 'viaje' data or no seats available to decrement.");
    }
  }



  async cancelarReserva() {
    const userId = (await this.firebaseSvc.getCurrentUser()).uid;
    const viajeId = this.id;
    const path = `viajes/${viajeId}`;

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
      })
      this.router.navigate(["/home"]);
    } catch (error) {
      console.error("Error cancelando reserva:", error);
    }
  }
}
