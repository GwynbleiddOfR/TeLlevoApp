import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
})
export class RegistroUsuarioPage implements OnInit {
  formularioRegistro!: FormGroup;
  esConductor: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formularioRegistro = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      rol: ['', Validators.required],
      patente: [''],
      marca: [''],
      modelo: ['']
    });
  }

  onRolChange(event: any) {
    const rol = event.detail.value;
    this.esConductor = rol === 'conductor';

    if (this.esConductor) {
      this.formularioRegistro.get('patente')?.setValidators([Validators.required]);
      this.formularioRegistro.get('marca')?.setValidators([Validators.required]);
      this.formularioRegistro.get('modelo')?.setValidators([Validators.required]);
    } else {
      this.formularioRegistro.get('patente')?.clearValidators();
      this.formularioRegistro.get('marca')?.clearValidators();
      this.formularioRegistro.get('modelo')?.clearValidators();
    }

    this.formularioRegistro.get('patente')?.updateValueAndValidity();
    this.formularioRegistro.get('marca')?.updateValueAndValidity();
    this.formularioRegistro.get('modelo')?.updateValueAndValidity();
  }

  registrarUsuario() {
    if (this.formularioRegistro.valid) {
      const usuario = this.formularioRegistro.value;
      console.log('Datos del usuario:', {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol
      });

      if (this.esConductor) {
        console.log('Datos del vehículo:', {
          patente: usuario.patente,
          marca: usuario.marca,
          modelo: usuario.modelo
        });
      } else {
        console.log('El usuario no es conductor, no hay datos de vehículo.');
      }
    }
  }
}