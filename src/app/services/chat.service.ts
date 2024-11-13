import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatRef = this.db.list('chat');

  constructor(private db: AngularFireDatabase) { }

  // Obtener mensajes del chat en tiempo real
  getMessages(): Observable<any[]> {
    return this.chatRef.valueChanges();
  }

  // Enviar un nuevo mensaje al chat
  sendMessage(user: string, message: string): void {
    const timestamp = new Date().getTime();
    this.chatRef.push({ user, message, timestamp });
  }
}