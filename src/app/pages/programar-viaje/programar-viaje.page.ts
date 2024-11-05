import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Viaje } from 'src/app/models/viaje.models';
@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {
  formularioViaje!: FormGroup;

  constructor(private fb: FormBuilder, private navCtrl: NavController) { }
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  ngOnInit() {
    this.formularioViaje = this.fb.group({
      horaSalida: [new Date().toISOString(), Validators.required],
      destino: ['', [Validators.required, Validators.minLength(3)]],
      costo: ['', [Validators.required, Validators.min(1)]],
    });
    console.log(this.firebaseSvc.getCurrentUser())
  }

  async confirmarViaje() {
    if (this.formularioViaje.valid) {
      const loading = await this.utilsSvc.loading();
      loading.present();
      const viajePath = 'viajes/${viaje.userId}'
      console.log(this.firebaseSvc.getCurrentUser())
    }
  }
}