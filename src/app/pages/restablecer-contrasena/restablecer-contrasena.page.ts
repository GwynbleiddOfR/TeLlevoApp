import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './restablecer-contrasena.page.html',
  styleUrls: ['./restablecer-contrasena.page.scss'],
})
export class RestablecerContrasenaPage implements OnInit {
  formularioRestablecerContrasena!: FormGroup;

  constructor(private fb: FormBuilder, private navCtrl: NavController) {}

  ngOnInit() {
    this.formularioRestablecerContrasena = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  enviarRestablecer() {
    if (this.formularioRestablecerContrasena.valid) {
      console.log('Correo enviado para restablecer:', this.formularioRestablecerContrasena.value);
    }
  }
}
