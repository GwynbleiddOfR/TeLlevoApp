import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestablecerContrasenaPageRoutingModule } from './restablecer-contrasena-routing.module';

import { RestablecerContrasenaPage } from './restablecer-contrasena.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RestablecerContrasenaPageRoutingModule
  ],
  declarations: [RestablecerContrasenaPage]
})
export class RestablecerContrasenaPageModule {}
