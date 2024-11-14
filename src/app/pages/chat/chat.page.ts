import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { FirebaseService } from 'src/app/services/firebase.service';
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
  userDisplayName: string | null = null;

  constructor(private route: ActivatedRoute, private chatService: ChatService, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.viajeId = this.route.snapshot.paramMap.get('id')!;
    this.subscribeToChat(this.viajeId);
    this.firebaseService.getCurrentUserDisplayName().then(displayName => {
      this.userDisplayName = displayName;
    });
  }

  subscribeToChat(viajeId: string) {
    this.chatService.getMessages(viajeId).subscribe(msgs => {
      this.messages = msgs;
    });
  }

  sendMessage() {
    if (this.newMessage) {
      const user = this.userDisplayName || 'Usuario'; // Utiliza el nombre del usuario o 'Usuario' por defecto
      this.chatService.sendMessage(this.viajeId, user, this.newMessage);
      this.newMessage = ''; // Limpiar el input
    }
  }
}