import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })
  
  constructor(private router: Router) { }
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

  ngOnInit() {
  }

  async iniciarSesion() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      loading.present();
      this.firebaseSvc.signIn(this.form.value as User).then(res => {
        this.router.navigate(["/home"])
      }).catch(error => {
        console.log(error)
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 5000,
          color: 'primary',
          position: 'top',
          icon: 'alert-circle-outline'

        })
      }).finally(() => { loading.dismiss(); })
    }
  }
}