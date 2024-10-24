import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

// Firebase
import { AngularFireModule } from '@angular/fire/compat';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),

    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ]
  ,
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy, }, Geolocation],
  bootstrap: [AppComponent],
})
export class AppModule { }
