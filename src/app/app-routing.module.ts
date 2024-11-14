import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'inicio-sesion',
    pathMatch: 'full'
  },
  {
    path: 'confirmacion',
    loadChildren: () => import('./pages/confirmacion/confirmacion.module').then(m => m.ConfirmacionPageModule)
  }, {
    path: 'ajustes',
    loadChildren: () => import('./pages/ajustes/ajustes.module').then(m => m.AjustesPageModule)
  },

  {
    path: 'historial-viajes',
    loadChildren: () => import('./pages/historial-viajes/historial-viajes.module').then(m => m.HistorialViajesPageModule)
  },


  {
    path: 'inicio-sesion',
    loadChildren: () => import('./pages/inicio-sesion/inicio-sesion.module').then(m => m.InicioSesionPageModule)
  },
  {
    path: 'lista-viajes',
    loadChildren: () => import('./pages/lista-viajes/lista-viajes.module').then(m => m.ListaViajesPageModule)
  },


  {
    path: 'notificaciones',
    loadChildren: () => import('./pages/notificaciones/notificaciones.module').then(m => m.NotificacionesPageModule)
  },


  {
    path: 'pago',
    loadChildren: () => import('./pages/pago/pago.module').then(m => m.PagoPageModule)
  },


  {
    path: 'perfil-usuario',
    loadChildren: () => import('./pages/perfil-usuario/perfil-usuario.module').then(m => m.PerfilUsuarioPageModule)
  },

  {
    path: 'programar-viaje',
    loadChildren: () => import('./pages/programar-viaje/programar-viaje.module').then(m => m.ProgramarViajePageModule)
  },

  {
    path: 'registro-usuario',
    loadChildren: () => import('./pages/registro-usuario/registro-usuario.module').then(m => m.RegistroUsuarioPageModule)
  },

  {
    path: 'restablecer-contrasena',
    loadChildren: () => import('./pages/restablecer-contrasena/restablecer-contrasena.module').then(m => m.RestablecerContrasenaPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)

  },  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
