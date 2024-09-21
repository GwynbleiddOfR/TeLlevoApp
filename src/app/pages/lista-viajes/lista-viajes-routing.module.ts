import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaViajesPage } from './lista-viajes.page';

const routes: Routes = [
  {
    path: '',
    component: ListaViajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaViajesPageRoutingModule {}
