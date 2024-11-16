import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);
  private loadingElement: HTMLIonLoadingElement;
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  async presentToast(options: ToastOptions) {
    const toast = await this.toastCtrl.create(options);
    toast.present();
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  saveInLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getFromlocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  async presentLoading() {
    this.loadingElement = await this.loadingCtrl.create({
      spinner: 'crescent', // Solo el spinner
      duration: 0 // Sin duración, se mantiene hasta que se llame a dismiss
    });
    await this.loadingElement.present();
  }

  async dismissLoading() {
    if (this.loadingElement) {
      await this.loadingElement.dismiss();
      this.loadingElement = null; // Limpiar la referencia después de ocultar
    }
  }
}
