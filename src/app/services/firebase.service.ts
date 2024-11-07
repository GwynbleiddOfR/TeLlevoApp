import { inject, Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc } from '@angular/fire/firestore';
import { doc, getDoc } from 'firebase/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(),path))).data();
  }

  registerVehicle(data: any) {
    const collectionPath = 'vehiculos';
    const documentId = data.patente; // Puedes usar cualquier otro ID único, si lo deseas.
    return setDoc(doc(getFirestore(), collectionPath, documentId), data);
  }

}
