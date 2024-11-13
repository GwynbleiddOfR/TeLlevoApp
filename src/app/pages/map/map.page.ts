import { Component, inject, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
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
  currentLocation: [number, number] = [-74.5, 40];
  directions: MapboxDirections;

  constructor(private geolocation: Geolocation, private router: Router) { }
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

        // Agregar marcador para la ubicación del viaje
        this.addDestinationMarker(this.viaje.longitud, this.viaje.latitud, this.viaje.destino);
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
    this.directions.setOrigin(this.currentLocation);
  }

  trackUserLocation() {
    this.geolocation.watchPosition().subscribe((position) => {
      if ('coords' in position) {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        this.currentLocation = [lng, lat];

        if (this.userMarker) {
          this.userMarker.setLngLat(this.currentLocation);
        } else {
          this.userMarker = this.addUserMarker(this.currentLocation[0], this.currentLocation[1]);
        }

        // Establecer la ubicación actual como el origen de la ruta
        this.directions.setOrigin(this.currentLocation);

        // Establecer el destino de la ruta en el marcador de destino
        this.directions.setDestination([this.viaje.longitud, this.viaje.latitud]);
      } else {
        console.error('Error obteniendo la ubicación:', position);
      }
    });
  }

  addUserMarker(lng: number, lat: number): mapboxgl.Marker {
    const marker = new mapboxgl.Marker({ color: 'green' })
      .setLngLat([lng, lat])
      .addTo(this.map);

    return marker;
  }

  addDestinationMarker(lng: number, lat: number, label: string) {
    const marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([lng, lat])
      .addTo(this.map);

    const popup = new mapboxgl.Popup({ offset: 25 })
      .setText(label)
      .setLngLat([lng, lat])
      .addTo(this.map);

    marker.setPopup(popup);
  }
}
