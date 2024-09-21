import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaViajesPageRoutingModule } from './lista-viajes-routing.module';

import { ListaViajesPage } from './lista-viajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaViajesPageRoutingModule
  ],
  declarations: [ListaViajesPage]
})
export class ListaViajesPageModule {}
