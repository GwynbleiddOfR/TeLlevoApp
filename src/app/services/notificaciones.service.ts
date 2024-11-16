import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  constructor() { }
  /**
 * Inicializa el servicio de notificaciones push.
 */
  async initPushNotifications() {
    try {
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive === 'granted') {
        await PushNotifications.register();
        this.registerListeners();
      } else {
        console.warn('Permiso de notificaciones no concedido');
      }
    } catch (error) {
      console.error('Error al inicializar las notificaciones push:', error);
    }
  }

  /**
   * Configura los listeners para los eventos de notificaciones.
   */
  private registerListeners() {
    // Listener para obtener el token del dispositivo
    PushNotifications.addListener('registration', (token) => {
      console.log('FCM Token recibido:', token.value);
      // Aquí puedes enviar el token a tu servidor si es necesario
    });

    // Listener para manejar notificaciones recibidas en segundo plano o primer plano
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notificación recibida:', notification);
      // Implementa lógica para mostrarla o manejarla según tu app
    });

    // Listener para manejar notificaciones cuando el usuario interactúa con ellas
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Acción de notificación:', action);
      // Implementa la lógica según la acción realizada por el usuario
    });

    // Listener para errores de registro
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error en el registro de notificaciones:', error);
    });
  }

  /**
   * Suscribe el dispositivo a un tema.
   * @param topic El tema al cual suscribirse
   */
  async subscribeToTopic(topic: string) {
    try {
      await FCM.subscribeTo({ topic });
      console.log(`Suscrito al tema: ${topic}`);
    } catch (error) {
      console.error(`Error al suscribirse al tema ${topic}:`, error);
    }
  }

  /**
   * Cancela la suscripción del dispositivo a un tema.
   * @param topic El tema al cual desuscribirse
   */
  async unsubscribeFromTopic(topic: string) {
    try {
      await FCM.unsubscribeFrom({ topic });
      console.log(`Desuscrito del tema: ${topic}`);
    } catch (error) {
      console.error(`Error al desuscribirse del tema ${topic}:`, error);
    }
  }
}
