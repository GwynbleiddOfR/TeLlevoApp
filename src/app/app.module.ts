import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

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
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },],
  bootstrap: [AppComponent],
})
export class AppModule { }
