import { Component, OnInit, inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { Platform } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
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

  constructor(private router: Router, private platform: Platform) { }
  firebaseSvc = inject(FirebaseService);
  utils = inject(UtilsService);
  chat = inject(ChatService);
  ngOnInit() {
    this.cargarDatos();
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }
  async cargarDatos() {
    let xtras = this.router.getCurrentNavigation()?.extras.state;
    if (xtras !== undefined) {
      this.id = xtras["id"];
      await this.utils.presentLoading(); // Mostrar loading al iniciar
      try {
        this.conductor = await this.firebaseSvc.getDocument('users/' + this.id);
        await this.utils.presentToast({
          message: "Datos del conductor cargados.",
          duration: 3000,
          color: 'success',
          position: 'top',
        });

        this.firebaseSvc.obtenerVehiculoPorUserId(this.id).subscribe((vehiculos) => {
          this.vehiculo = vehiculos[0];
        });

        const path = `viajes/${this.id}`;
        this.firebaseSvc.getRealtimeData(path).subscribe({
          next: async (viaje) => {
            this.viaje = viaje; // Update the trip data in real time
            await this.utils.presentToast({
              message: "Datos del viaje actualizados.",
              duration: 3000,
              color: 'success',
              position: 'top',
            });
          },
          error: async (error) => {
            await this.utils.presentToast({
              message: "Error al obtener datos del viaje.",
              duration: 3000,
              color: 'danger',
              position: 'top',
            });
          },
        });
        await this.checkReserva(); // Verificar reserva al cargar el viaje
      } catch (error) {
        await this.utils.presentToast({
          message: "No tienes conexion a internet",
          duration: 3000,
          color: 'danger',
          position: 'top',
        });
        this.viaje = this.utils.getFromlocalStorage('viaje');
        this.conductor = this.utils.getFromlocalStorage('conductor');
        this.vehiculo = this.utils.getFromlocalStorage('vehiculo');
      } finally {
        await this.utils.dismissLoading(); // Ocultar loading
      }
    }
  }

  async checkReserva() {
    const userId = (await this.firebaseSvc.getCurrentUser()).uid;
    try {
      const reservaPath = `users/${userId}/reservas/${this.id}`;
      this.firebaseSvc.getRealtimeData(reservaPath).subscribe({
        next: async (reservaDoc) => {
          if (reservaDoc) {
            this.reservado = true;
            await this.utils.presentToast({
              message: "Reserva encontrada.",
              duration: 3000,
              color: 'success',
              position: 'top',
            });
          } else {
            this.reservado = false;
            await this.utils.presentToast({
              message: "No tienes una reserva activa.",
              duration: 3000,
              color: 'warning',
              position: 'top',
            });
          }
        },
        error: async (error) => {
          this.reservado = false;
          await this.utils.presentToast({
            message: "Error al verificar la reserva. Intenta nuevamente.",
            duration: 3000,
            color: 'danger',
            position: 'top',
          });
        },
      });
    } catch (error) {
      this.reservado = false;
      await this.utils.presentToast({
        message: "Error inesperado al verificar la reserva.",
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
    }
  }

  async confirmar() {
    const user = await this.firebaseSvc.getCurrentUser();
    const userId = user.uid;
    if (this.conductor && this.conductor.uid === userId) {
      await this.utils.presentToast({
        message: "No puedes reservar tu propio viaje.",
        duration: 5000,
        color: 'primary',
        position: 'top',
        icon: 'alert-circle-outline',
      });
      return;
    }


    if ((await Network.getStatus()).connected) {
      if (this.viaje && this.viaje.asientos !== undefined && this.viaje.asientos > 0) {
        const path = `viajes/${this.id}`;
        const updatedAsientos = this.viaje.asientos - 1;
        const reserva = {
          userId: userId,
          viajeId: this.id,
          fechaReserva: new Date().toISOString(),
        };

        await this.utils.presentLoading();

        try {
          await this.firebaseSvc.updateRealtimeData(path, { asientos: updatedAsientos });
          await this.firebaseSvc.setRealtimeData(`users/${userId}/reservas/${this.id}`, reserva);

          this.reservado = true;
          this.utils.saveInLocalStorage('viaje', this.viaje);
          this.utils.saveInLocalStorage('conductor', this.conductor);
          this.utils.saveInLocalStorage('vehiculo', this.vehiculo);
          this.chat.sendMessage(this.id, 'Sistema', `¡Reserva confirmada por ${user.displayName}!`);
          await this.utils.presentToast({
            message: "Reserva exitosa.",
            duration: 5000,
            color: 'success',
            position: 'top',
          });
          this.verMapa(this.id);
        } catch (error) {
          await this.utils.presentToast({
            message: "Error al confirmar la reserva.",
            duration: 3000,
            color: 'danger',
            position: 'top',
          });
        } finally {
          await this.utils.dismissLoading();
        }
      } else {
        await this.utils.presentToast({
          message: "Datos de viaje inválidos o sin asientos disponibles.",
          duration: 3000,
          color: 'warning',
          position: 'top',
        });
      }
    } else {
      await this.utils.presentToast({
        message: "No hay conexión a internet.",
        duration: 3000,
        color: 'warning',
        position: 'top',
      });
    }
  }

  async cancelarReserva() {
    if ((await Network.getStatus()).connected) {
      const user = await this.firebaseSvc.getCurrentUser();
      const userId = (await this.firebaseSvc.getCurrentUser()).uid;
      const viajeId = this.id;
      const path = `viajes/${viajeId}`;

      await this.utils.presentLoading();

      try {
        const currentAsientos = this.viaje.asientos;
        const updatedAsientos = currentAsientos + 1;

        await this.firebaseSvc.deleteRealtimeData(`/users/${userId}/reservas/${viajeId}`);
        await this.firebaseSvc.updateRealtimeData(path, { asientos: updatedAsientos });
        this.reservado = false;
        this.chat.sendMessage(viajeId, 'Sistema', `¡Reserva cancelada por ${user.displayName}!`);
        await this.utils.presentToast({
          message: "Reserva cancelada.",
          duration: 5000,
          color: 'primary',
          position: 'top',
        });
        this.router.navigate(["/home"]);
      } catch (error) {
        await this.utils.presentToast({
          message: "Error al cancelar la reserva.",
          duration: 3000,
          color: 'danger',
          position: 'top',
        });
      } finally {
        await this.utils.dismissLoading();
      }
    } else {
      await this.utils.presentToast({
        message: "No hay conexión a internet.",
        duration: 3000,
        color: 'warning',
        position: 'top',
      });
    }
  }

  async verMapa(id: string) {
    if ((await Network.getStatus()).connected) {
      let xtras: NavigationExtras = {
        state: {
          id: id,
        },
      };
      this.router.navigate(['/map'], xtras);
    } else {
      await this.utils.presentToast({
        message: "No hay conexión a internet.",
        duration: 3000,
        color: 'warning',
        position: 'top',
      });
    }
  }
}