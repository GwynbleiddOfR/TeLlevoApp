import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramarViajePage } from './programar-viaje.page';

describe('ProgramarViajePage', () => {
  let component: ProgramarViajePage;
  let fixture: ComponentFixture<ProgramarViajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramarViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
