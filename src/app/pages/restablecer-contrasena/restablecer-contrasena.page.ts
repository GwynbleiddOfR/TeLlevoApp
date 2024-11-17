import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './restablecer-contrasena.page.html',
  styleUrls: ['./restablecer-contrasena.page.scss'],
})
export class RestablecerContrasenaPage implements OnInit {
  formularioRestablecerContrasena!: FormGroup;

  constructor(private fb: FormBuilder, private navCtrl: NavController) { }
  firebaseSvc = inject(FirebaseService);
  utils = inject(UtilsService);
  ngOnInit() {
    this.formularioRestablecerContrasena = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  enviarRestablecer() {
    if (this.formularioRestablecerContrasena.valid) {
      this.firebaseSvc.sendRecoveryEmail(this.formularioRestablecerContrasena.value.correo)
        .then(() => {
          this.utils.presentToast({
            message: 'Se ha enviado un correo para restablecer tu contraseña',
            duration: 1500,
            position: 'top',
            color: 'success',
            icon: 'mail'
          });
          this.utils.routerLink('/inicio-sesion');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
}
