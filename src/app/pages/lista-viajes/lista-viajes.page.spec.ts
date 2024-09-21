import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaViajesPage } from './lista-viajes.page';

describe('ListaViajesPage', () => {
  let component: ListaViajesPage;
  let fixture: ComponentFixture<ListaViajesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaViajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
