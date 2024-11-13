import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  messages: any[] = [];
  newMessage: string = '';
  userData: any; // Aquí almacenaremos los datos del usuario autenticado

  firebaseSvc = inject(FirebaseService);
  chatService = inject(ChatService);

  ngOnInit() {
    this.firebaseSvc.auth.onAuthStateChanged(async (user) => {
      if (user) {
        // El usuario está autenticado, obtenemos los datos de Firestore
        try {
          const path = `users/${user.uid}`;
          this.userData = await this.firebaseSvc.getDocument(path);
          console.log("User data fetched:", this.userData); // Verificar que los datos están llegando

          // Escucha los mensajes en tiempo real
          this.chatService.getMessages().subscribe((messages) => {
            this.messages = messages;
          });

        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // Si no hay usuario autenticado, mostramos un mensaje
        console.warn("No user is currently logged in.");
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.userData) {
      console.log("UserData in sendMessage:", this.userData); // Verificar los datos aquí

      const userName = this.userData && this.userData.name && this.userData.lastname ? 
        `${this.userData.name} ${this.userData.lastname}` : 'Usuario';
        
      console.log("Sending message as:", userName); // Verificar qué nombre se está enviando

      this.chatService.sendMessage(userName, this.newMessage);
      this.newMessage = '';
    }
  }
}