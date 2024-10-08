import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {
  formularioInicioSesion: FormGroup;

  constructor(private fb: FormBuilder, private navCtrl: NavController) {
    this.formularioInicioSesion = this.fb.group({});
  }

  ngOnInit() {
    this.formularioInicioSesion = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  iniciarSesion() {
    if (this.formularioInicioSesion.valid) {
      console.log('Formulario enviado:', this.formularioInicioSesion.value);
      // Aqui vamo a programar q pasa cuando se inicie sesion
    }
  }
}