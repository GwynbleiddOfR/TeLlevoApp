import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
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
  }

  async confirmarViaje() {
    if (this.formularioViaje.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        const user = await this.firebaseSvc.auth.currentUser;  // Ensure `currentUser` is accessible
        if (user) {
          const path = `viajes/${user.uid}`;  // Correct string interpolation
          this.firebaseSvc.setDocument(path, this.formularioViaje.value);
          // Continue with your logic to handle the viajePath
        }
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        loading.dismiss();  // Ensure the loading spinner is hidden when done
      }
    }
  }
}