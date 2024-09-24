import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historial-viajes',
  templateUrl: './historial-viajes.page.html',
  styleUrls: ['./historial-viajes.page.scss'],
})
export class HistorialViajesPage implements OnInit {

  viajes = [
    { fecha: new Date('2024-09-10'), costo: 5000, patente: 'AB-CD-12', chofer: 'Mario Zapata' },
    { fecha: new Date('2024-09-12'), costo: 7000, patente: 'XY-ZT-89',  chofer: 'Alejandro Sepulveda'},
    { fecha: new Date('2024-09-15'), costo: 6000, patente: 'LM-NA-56',  chofer: 'Simon Muñoz' },
  ];

  constructor() { }

  ngOnInit() {}
}
