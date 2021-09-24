import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  constructor(
    private firestore: AngularFirestore,
  ) { }

  getAllStudents(){
    return this.firestore.collection("Estudiantes").snapshotChanges();
  }

  createStudent(student:any){
    return this.firestore.collection("Estudiantes").add(student);
  }

  updateStudent(id:any, data:any ){
    return this.firestore.collection("Estudiantes").doc(id).update(data);
  }

  deleteStudent(id:any){
    return this.firestore.collection("Estudiantes").doc(id).delete();
  }



}
