import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
})
export class RegistroUsuarioPage implements OnInit {

  formularioRegistroVehiculo!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.formularioRegistroVehiculo = this.fb.group({
      patente: ['', [Validators.required, Validators.minLength(6)]],
      marca: ['', [Validators.required, Validators.minLength(2)]],
      modelo: ['', [Validators.required, Validators.minLength(2)]],
      anio: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]]
    });
  }

  registrarVehiculo() {
    if (this.formularioRegistroVehiculo.valid) {
      console.log('Datos del vehículo registrado:', this.formularioRegistroVehiculo.value);
    }
  }
}