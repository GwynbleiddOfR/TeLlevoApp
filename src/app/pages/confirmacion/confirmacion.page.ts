import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.page.html',
  styleUrls: ['./confirmacion.page.scss'],
})
export class ConfirmacionPage implements OnInit {
  viaje: any;
  id: any;
  conductor: any;
  vehiculo: any;
  constructor(private router: Router) { }
  firebaseSvc = inject(FirebaseService);
  ngOnInit() {
    let xtras = this.router.getCurrentNavigation()?.extras.state;
    if (xtras !== undefined) {
      this.id = xtras["id"];
      this.firebaseSvc.getDocument('users/' + this.id).then((doc) => {
        this.conductor = doc;
      });
      this.firebaseSvc.obtenerVehiculoPorUserId(this.id).subscribe((vehiculos) => {
        this.vehiculo = vehiculos[0];
      });
      const path = `viajes/${xtras["id"]}`;
      try {
        this.firebaseSvc.getDocument(path).then((doc) => {
          this.viaje = doc;
        }).catch((error) => {
          console.error("Error getting document:", error);
        });
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    }
  }

  async confirmar() {
    // Check if 'viaje' and 'asientos' are valid before proceeding
    if (this.viaje && this.viaje.asientos !== undefined && this.viaje.asientos > 0) {
      const path = `viajes/${this.viaje.id}`;  // Ensure 'viaje.id' is defined

      // Decrement the available seats
      const updatedAsientos = this.viaje.asientos - 1;

      try {
        // Update the Firestore document
        await this.firebaseSvc.updateDocument(path, { asientos: updatedAsientos });

        // Navigate to the home page after the update is successful
        this.router.navigate(["/home"]);
      } catch (error) {
        // Handle any errors that occur during the document update
        console.error("Error updating document:", error);
      }
    } else {
      // If 'asientos' is not valid or there are no seats left, show an error
      console.error("Invalid 'viaje' data or no seats available to decrement.");
      // Optionally, show a user-friendly message here (e.g., using an alert)
    }
  }

}
