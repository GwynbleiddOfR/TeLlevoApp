import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private db: AngularFireDatabase) { }

  // Obtener mensajes del chat en tiempo real para un viaje específico
  getMessages(viajeId: string): Observable<any[]> {
    return this.db.list(`chat/${viajeId}`).valueChanges();
  }

  // Enviar un nuevo mensaje al chat de un viaje específico
  sendMessage(viajeId: string, user: string, message: string): void {
    const timestamp = new Date().getTime();
    this.db.list(`chat/${viajeId}`).push({ user, message, timestamp });
  }
  deleteChat(viajeId: string): void {
    this.db.list(`chat/${viajeId}`).remove();
  }
}