import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import mapboxgl from 'mapbox-gl';
import * as mapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Router } from '@angular/router';
@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {
  formularioViaje!: FormGroup;
  map: mapboxgl.Map;
  constructor(private fb: FormBuilder, private router:Router) { }
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  ngOnInit() {
    this.formularioViaje = this.fb.group({
      horaSalida: [new Date().toISOString(), Validators.required],
      destino: ['', [Validators.required]],
      costo: ['', [Validators.required, Validators.min(1)]],
    });
    this.initializeMap();
  }

  async confirmarViaje() {
    if (this.formularioViaje.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        const user = await this.firebaseSvc.auth.currentUser;  // Ensure `currentUser` is accessible
        if (user) {
          const path = `viajes/${user.uid}`;  // Correct string interpolation
          this.firebaseSvc.setDocument(path, this.formularioViaje.value);
          // Continue with your logic to handle the viajePath
        }
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        loading.dismiss();
        this.router.navigate(["/home"])  // Ensure the loading spinner is hidden when done
      }
    }
  }

  initializeMap() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VhcGlsZW8iLCJhIjoiY20ybnJpZTlhMDlqNzJscHU2NjF1enptMCJ9.aWtLWdpfsRCMSZwJeu_anQ'; // Sustituye con tu token de Mapbox

    this.map = new mapboxgl.Map({
      container: 'map', // El ID del contenedor del mapa en el HTML
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // Coordenadas iniciales
      zoom: 9
    });
    const geocoder = new mapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: {
        color: 'orange'
      },
      mapboxgl: mapboxgl
    });

    this.map.addControl(geocoder);
    geocoder.on('result', (e) => {
      const lngLat = e.result.geometry.coordinates;
      this.map.flyTo({
        center: lngLat,
        essential: true, // Hace que el movimiento sea fluido
        zoom: 14
      });
      this.formularioViaje.controls['destino'].setValue(e.result.place_name);
    })
  }

}