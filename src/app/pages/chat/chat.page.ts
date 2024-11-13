import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  viajeId: string;
  messages: any[] = [];
  newMessage: string = '';

  constructor(private route: ActivatedRoute, private chatService: ChatService) {}

  ngOnInit() {
    this.viajeId = this.route.snapshot.paramMap.get('id')!;
    this.subscribeToChat(this.viajeId);
  }

  subscribeToChat(viajeId: string) {
    this.chatService.getMessages(viajeId).subscribe(msgs => {
      this.messages = msgs;
    });
  }

  sendMessage() {
    if (this.newMessage) {
      const user = 'Usuario'; // Aquí puedes obtener el nombre del usuario
      this.chatService.sendMessage(this.viajeId, user, this.newMessage);
      this.newMessage = ''; // Limpiar el input
    }
  }
}