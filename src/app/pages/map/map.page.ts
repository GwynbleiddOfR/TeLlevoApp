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
  currentLocation: [number, number] = [-74.5, 40];

  constructor(private geolocation: Geolocation) {}

  ngOnInit() {
    this.initializeMap();
    this.trackUserLocation();
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

    this.map.on('moveend', () => {
      const center = this.map.getCenter();
      localStorage.setItem('mapLocation', JSON.stringify([center.lng, center.lat]));
    });

    this.map.on('zoomend', () => {
      const zoom = this.map.getZoom();
      localStorage.setItem('mapZoom', zoom.toString());
    });
  }

  zoomIn() {
    const currentZoom = this.map.getZoom();
    this.map.setZoom(currentZoom + 1);
  }

  zoomOut() {
    const currentZoom = this.map.getZoom();
    this.map.setZoom(currentZoom - 1);
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
          this.userMarker = new mapboxgl.Marker()
            .setLngLat(this.currentLocation)
            .addTo(this.map);
        }

        this.map.setCenter(this.currentLocation);
      } else {
        console.error('Error obteniendo la ubicación:', position);
      }
    });
  }
}
