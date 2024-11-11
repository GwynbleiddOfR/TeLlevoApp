import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
})
export class RegistroUsuarioPage implements OnInit {

  formularioRegistroVehiculo!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.formularioRegistroVehiculo = this.fb.group({
      patente: ['', [Validators.required, Validators.minLength(6)]],
      marca: ['', [Validators.required, Validators.minLength(2)]],
      modelo: ['', [Validators.required, Validators.minLength(2)]],
      anio: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      userid: []
    });
  }

  async registrarVehiculo() {
    if (this.formularioRegistroVehiculo.valid) {
      const currentUser = await this.firebaseService.getCurrentUser();
      this.formularioRegistroVehiculo.value.userid = currentUser.uid;
      const vehiculoData = this.formularioRegistroVehiculo.value;
      try {
        await this.firebaseService.registerVehicle(vehiculoData);
        console.log('Vehículo registrado exitosamente');
        this.utilsService.presentToast({
          message: 'Vehículo registrado correctamente',
          duration: 3000,
          color: 'success',
          position: 'top'
        });
      } catch (error) {
        console.error('Error al registrar el vehículo:', error);
        this.utilsService.presentToast({
          message: 'Vehículo registrado correctamente',
          duration: 3000,  // Duración en milisegundos, opcional
          color: 'danger',
          position: 'top'   // Puedes cambiar la posición si lo deseas
        });
      }
    } else {
      console.log('Formulario inválido');
      this.utilsService.presentToast({
        message: 'Vehículo registrado correctamente',
        duration: 3000,  // Duración en milisegundos, opcional
        color: 'warning',
        position: 'top'   // Puedes cambiar la posición si lo deseas
      });
    }
  }
}
