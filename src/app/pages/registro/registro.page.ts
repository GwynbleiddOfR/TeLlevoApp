import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })

  constructor(private router: Router) { }
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)
  ngOnInit() {
  }

  async registro() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      loading.present();
      this.firebaseSvc.signUp(this.form.value as User).then(async res => {
        await this.firebaseSvc.updateUser(this.form.value.name)
        this.router.navigate(["/inicio-sesion"])
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
