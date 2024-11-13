import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-chat',  // Aquí debes usar el selector correcto
  templateUrl: 'chat.page.html',  // Asegúrate de que el nombre del archivo HTML sea el correcto
  styleUrls: ['chat.page.scss'],  // Asegúrate de que el archivo SCSS también sea el correcto
})
export class ChatPage implements OnInit {
  messages: any[] = [];
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Suscribirse a los mensajes desde Firebase
    this.chatService.getMessages().subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage('Usuario', this.newMessage); // Puedes cambiar 'Usuario' por cualquier nombre dinámico
      this.newMessage = ''; // Limpiar el campo de entrada después de enviar el mensaje
    }
  }
}
