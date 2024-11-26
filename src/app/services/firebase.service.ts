import { inject, Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc } from '@angular/fire/firestore';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  realtime = inject(AngularFireDatabase);
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }
  signOut() {
    return this.auth.signOut();
  }
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email)
  }

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  registerVehicle(data: any) {
    const collectionPath = 'vehiculos';
    const documentId = data.patente;
    return setDoc(doc(getFirestore(), collectionPath, documentId), data);
  }
  obtenerVehiculoPorUserId(userId: string): Observable<any[]> {
    return this.firestore.collection('vehiculos', ref => ref.where('userid', '==', userId)).valueChanges();
  }
  getCurrentUser() {
    return this.auth.currentUser;
  }

  async getCurrentUserDisplayName(): Promise<string | null> {
    const user = getAuth().currentUser;
    return user ? user.displayName : null;
  }

  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  getRealtimeData(path: string) {
    return this.realtime.object(path).valueChanges();
  }

  setRealtimeData(path: string, data: any) {
    return this.realtime.object(path).set(data);
  }
  deleteRealtimeData(path: string) {
    return this.realtime.object(path).remove();
  }
  updateRealtimeData(path: string, data: any) {
    return this.realtime.object(path).update(data);
  }
}
