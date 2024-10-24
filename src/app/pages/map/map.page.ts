import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map: mapboxgl.Map;
  userMarker: mapboxgl.Marker;
  currentLocation: [number, number];

  constructor(private geolocation: Geolocation) {}

  ngOnInit() {
    this.initializeMap();
    this.trackUserLocation();
  }

  initializeMap() {
    (mapboxgl as any).accessToken = 'pk.eyJ1Ijoic2VhcGlsZW8iLCJhIjoiY20ybnJpZTlhMDlqNzJscHU2NjF1enptMCJ9.aWtLWdpfsRCMSZwJeu_anQ';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // Coordenadas iniciales
      zoom: 14,
    });
  }

  trackUserLocation() {
    this.geolocation.watchPosition().subscribe((position) => {
      // Verifica si el objeto es de tipo Geoposition y contiene coords
      if ('coords' in position) {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        this.currentLocation = [lng, lat];

        if (this.userMarker) {
          this.userMarker.setLngLat(this.currentLocation); // Actualiza la ubicación del marcador
        } else {
          this.userMarker = new mapboxgl.Marker()
            .setLngLat(this.currentLocation)
            .addTo(this.map); // Crea un nuevo marcador si no existe
        }

        this.map.setCenter(this.currentLocation); // Centra el mapa en la ubicación actual
      } else {
        console.error('Error obteniendo la ubicación:', position);
      }
    });
  }
}
