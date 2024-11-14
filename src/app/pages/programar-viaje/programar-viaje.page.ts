import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import * as mapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {
  formularioViaje!: FormGroup;
  currentLocation: { lat: number, lng: number } | null = null;

  constructor(private fb: FormBuilder, private router: Router) { }
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  chat = inject(ChatService);
  ngOnInit() {
    this.formularioViaje = this.fb.group({
      horaSalida: [new Date().toISOString(), Validators.required],
      destino: ['', [Validators.required]],
      costo: ['', [Validators.required, Validators.min(1)]],
      latitud: ['', Validators.required],  // Store latitude
      longitud: ['', Validators.required], // Store longitude
      asientos: [1, [Validators.required, Validators.min(1)]],
    });

    this.initializeGeocoder();
    this.getCurrentLocation();  // Get the current location
  }

  // Function to get the current geographic location
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.currentLocation = { lat: latitude, lng: longitude };

          // Set the initial coordinates in the form
          this.formularioViaje.controls['latitud'].setValue(latitude);
          this.formularioViaje.controls['longitud'].setValue(longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // You can provide a fallback or error handling here if needed
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  // Function to handle confirming the trip
  async confirmarViaje() {
    if (this.formularioViaje.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
      let user = (await this.firebaseSvc.getCurrentUser()).uid;
      this.chat.deleteChat(user);
      try {
        const user = await this.firebaseSvc.auth.currentUser;
        if (user) {
          const viajeData = {
            ...this.formularioViaje.value,
            ubicacionActual: this.currentLocation, // Include the current location
          };

          const path = `viajes/${user.uid}`;
          await this.firebaseSvc.setDocument(path, viajeData); // Save the trip data
        }
      } catch (error) {
        console.error('Error confirming trip:', error);
      } finally {
        loading.dismiss();
        this.router.navigate(['/home']);
      }
    }
  }

  initializeGeocoder() {
    mapboxGeocoder.accessToken = 'pk.eyJ1Ijoic2VhcGlsZW8iLCJhIjoiY20ybnJpZTlhMDlqNzJscHU2NjF1enptMCJ9.aWtLWdpfsRCMSZwJeu_anQ'; // Your Mapbox Token

    const geocoder = new mapboxGeocoder({
      accessToken: mapboxGeocoder.accessToken,
      marker: { color: 'orange' },
      mapboxgl: mapboxGeocoder,
    });

    const geocoderContainer = document.getElementById('geocoder');
    if (geocoderContainer) {
      geocoderContainer.appendChild(geocoder.onAdd());
    }

    geocoder.on('result', (e) => {
      const lngLat = e.result.geometry.coordinates;
      this.formularioViaje.controls['destino'].setValue(e.result.place_name);

      // Update the form with the selected destination latitude and longitude
      this.formularioViaje.controls['latitud'].setValue(lngLat[1]);
      this.formularioViaje.controls['longitud'].setValue(lngLat[0]);
    });
  }
}

