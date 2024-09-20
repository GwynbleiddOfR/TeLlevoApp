import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {
  formularioViaje!: FormGroup;

  constructor(private fb: FormBuilder, private navCtrl: NavController) {}

  ngOnInit() {
    this.formularioViaje = this.fb.group({
      horaSalida: [new Date().toISOString(), Validators.required],
      destino: ['', [Validators.required, Validators.minLength(3)]],
      costo: ['', [Validators.required, Validators.min(1)]],
    });
  }

  confirmarViaje() {
    if (this.formularioViaje.valid) {
      console.log('Formulario enviado:', this.formularioViaje.value);
    }
  }
}