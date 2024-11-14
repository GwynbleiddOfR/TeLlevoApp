import { Component, inject, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map: mapboxgl.Map;
  userMarker: mapboxgl.Marker;
  currentLocation: [number, number] = [-36.79740609238323, -73.06133749982848];
  directions: MapboxDirections;

  constructor(private router: Router) { }

  id: any;
  viaje: any;
  firebaseSvc = inject(FirebaseService);

  ngOnInit() {
    let xtras = this.router.getCurrentNavigation()?.extras.state;
    if (xtras !== undefined) {
      this.id = xtras["id"];
      const path = `viajes/${this.id}`;
      this.firebaseSvc.getDocument(path).then((doc) => {
        this.viaje = doc;
        this.initializeMap();
        this.trackUserLocation();
        this.addStartingPointMarker(this.viaje.ubicacionActual.lng, this.viaje.ubicacionActual.lat);
        this.addDestinationMarker(this.viaje.longitud, this.viaje.latitud, this.viaje.destino);
        if (this.directions) {
          this.directions.setOrigin([this.viaje.ubicacionActual.lng, this.viaje.ubicacionActual.lat]);
          this.directions.setDestination([this.viaje.longitud, this.viaje.latitud]);
        }
      });
    }
  }

  initializeMap() {
    (mapboxgl as any).accessToken = 'pk.eyJ1Ijoic2VhcGlsZW8iLCJhIjoiY20ybnJpZTlhMDlqNzJscHU2NjF1enptMCJ9.aWtLWdpfsRCMSZwJeu_anQ';
    const savedLocation = localStorage.getItem('mapLocation');
    const savedZoom = localStorage.getItem('mapZoom');

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: savedLocation ? JSON.parse(savedLocation) : this.currentLocation,
      zoom: savedZoom ? Number(savedZoom) : 14,
    });

    // Configuración del mapa Directions
    this.directions = new MapboxDirections({
      accessToken: (mapboxgl as any).accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
      interactive: false,
      controls: {
        inputs: false, // Ocultar la barra de direcciones
        instructions: false, // Ocultar instrucciones
      },
    });

    this.map.addControl(this.directions, 'top-left');
    if (this.viaje) {
      this.directions.setOrigin([this.viaje.ubicacionActual.lng, this.viaje.ubicacionActual.lat]);
      this.directions.setDestination([this.viaje.longitud, this.viaje.latitud]);
    }
  }

  async trackUserLocation() {
    try {
      const position = await Geolocation.watchPosition({}, (position, err) => {
        if (err) {
          console.error('Error obteniendo la ubicación:', err);
          return;
        }
        if (position) {
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;
          this.currentLocation = [lng, lat];

          if (this.userMarker) {
            this.userMarker.setLngLat(this.currentLocation);
          } else {
            this.userMarker = this.addUserMarker(this.currentLocation[0], this.currentLocation[1]);
          }
        }
      });
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
    }
  }

  addUserMarker(lng: number, lat: number): mapboxgl.Marker {
    const marker = new mapboxgl.Marker({ color: 'blue' })
      .setLngLat([lng, lat])
      .addTo(this.map);

    return marker;
  }

  addDestinationMarker(lng: number, lat: number, label: string) {
    const marker = new mapboxgl.Marker({ color: 'green' })
      .setLngLat([lng, lat])
      .addTo(this.map);

    const popup = new mapboxgl.Popup({ offset: 25 })
      .setText(label)
      .setLngLat([lng, lat])
      .addTo(this.map);

    marker.setPopup(popup);
  }

  addStartingPointMarker(lng: number, lat: number) {
    const marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([lng, lat])
      .addTo(this.map);
  }

}
