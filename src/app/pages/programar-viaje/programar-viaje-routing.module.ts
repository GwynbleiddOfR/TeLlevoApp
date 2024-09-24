import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramarViajePage } from './programar-viaje.page';

const routes: Routes = [
  {
    path: '',
    component: ProgramarViajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramarViajePageRoutingModule {}
