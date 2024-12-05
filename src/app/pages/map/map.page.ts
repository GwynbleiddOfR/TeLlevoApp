import { Component, inject, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Platform } from '@ionic/angular';

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
  locationWatcher: any;

  constructor(private router: Router, private platform: Platform) {
    this.platform.resume.subscribe(() => {
      this.initializeMap();
    });
  }

  id: any;
  viaje: any;
  firebaseSvc = inject(FirebaseService);

  ngOnInit() {
    this.requestPermissions();
    this.loadViajeData();
  }

  ionViewWillEnter() {
    if (this.map) {
      this.map.resize();
      this.loadViajeData(); // Recargar datos al volver a la vista
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove(); // Libera recursos al destruir la página
    }
    if (this.locationWatcher) {
      Geolocation.clearWatch({ id: this.locationWatcher }); // Limpiar el watcher al destruir el componente
    }
  }

  async requestPermissions() {
    try {
      const permissionStatus = await Geolocation.requestPermissions();
      if (permissionStatus.location === 'granted') {
        console.log('Permission granted!');
      } else {
        console.log('Permission denied!');
      }
    } catch (error) {
      console.error('Error requesting geolocation permissions:', error);
    }
  }

  async loadViajeData() {
    let xtras = this.router.getCurrentNavigation()?.extras.state;
    if (xtras !== undefined) {
      this.id = xtras["id"];
      const path = `viajes/${this.id}`;
      this.firebaseSvc.getRealtimeData(path).subscribe((doc) => {
        this.viaje = doc;
        console.log('Datos del viaje cargados:', this.viaje); // Verifica los datos del viaje
        if (!this.map) {
          this.initializeMap();
        }
        this.trackUserLocation();
        this.updateMarkers();
      });
    }
  }

  initializeMap() {
    try {
      mapboxgl.accessToken = 'pk.eyJ1IjoiZi1jLXUiLCJhIjoiY200YWt4OWR6MDEzbzJrbXpmeG11azRmZSJ9.CF9dLV9uCV3lC-FdxiTzew';
      const savedLocation = localStorage.getItem('mapLocation');
      const savedZoom = localStorage.getItem('mapZoom');

      const center = savedLocation ? JSON.parse(savedLocation) : this.currentLocation;
      const zoom = savedZoom ? parseFloat(savedZoom) : 12;

      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: zoom,
      });

      this.directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
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
        this.updateMarkers();
      }
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }
  }

  async trackUserLocation() {
    try {
      this.locationWatcher = await Geolocation.watchPosition({}, (position, err) => {
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

  updateMarkers() {
    if (this.viaje) {
      // Establecer el origen y destino para la ruta
      this.directions.setOrigin([this.viaje.ubicacionActual.lng, this.viaje.ubicacionActual.lat]);
      this.directions.setDestination([this.viaje.longitud, this.viaje.latitud]);

      this.addStartingPointMarker(this.viaje.ubicacionActual.lng, this.viaje.ubicacionActual.lat);
      this.addDestinationMarker(this.viaje.longitud, this.viaje.latitud, this.viaje.destino);
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

    this.createPopup(marker, 'Punto de partida', lng, lat);
  }

  private createPopup(marker: mapboxgl.Marker, text: string, lng: number, lat: number) {
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setText(text)
      .setLngLat([lng, lat])
      .addTo(this.map);

    marker.setPopup(popup);
  }
}