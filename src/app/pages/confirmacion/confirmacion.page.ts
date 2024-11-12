import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.page.html',
  styleUrls: ['./confirmacion.page.scss'],
})
export class ConfirmacionPage implements OnInit {
  viaje: any;
  constructor(private router: Router) { }
  firebaseSvc = inject(FirebaseService);
  ngOnInit() {
    let xtras = this.router.getCurrentNavigation()?.extras.state;
    if (xtras !== undefined) {
      const path = `viajes/${xtras["id"]}`;
      this.firebaseSvc.getDocument(path).then((doc) => {
        this.viaje = doc;
      });
    }
  }
}
