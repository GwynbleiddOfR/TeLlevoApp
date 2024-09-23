import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmacionPage } from './confirmacion.page';

describe('ConfirmacionPage', () => {
  let component: ConfirmacionPage;
  let fixture: ComponentFixture<ConfirmacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
