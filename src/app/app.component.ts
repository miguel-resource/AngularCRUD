import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

//Service
import { FirebaseServiceService } from './services/firebase-service.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  config: any;
  //Número de datos y data
  collection = { count: 20, data: [{id:0, nombre: "nombre 0", apellido: "apellido 0"}]};
  closeResult = '';

  idUpdateFirebase: string = "";
  estudianteForm!: FormGroup;
  isEdit: boolean = false;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    private fireBaseService: FirebaseServiceService,
  ) {

  }

  ngOnInit(): void {

    //Validación de estudiantes
    this.estudianteForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required]
    })
    
    //Insertar todos los datos
    this.fireBaseService.getAllStudents().subscribe(resp => {
      this.collection.data = resp.map((e:any) => {
        return {
          id: e.payload.doc.data().id,
          nombre: e.payload.doc.data().nombre,
          apellido: e.payload.doc.data().apellido,
          idFireBase: e.payload.doc.id
        }
      })
    }, err => {
      console.error(err)
    })

    this.config = {
      itemsPerPage: 10,
      currentPage: 2,
      totalItems: this.collection.count
    }
  }

  pageChanged(event: any){
    this.config.currentPage = event;
  }

  saveStudent(){
    this.fireBaseService.createStudent(this.estudianteForm.value).then(resp => {
      this.estudianteForm.reset();
      this.modalService.dismissAll();
    }).catch(err => {
      console.error(err);
    });

  }

  updateStudent():void {
    console.log("updateNotYet: "+this.idUpdateFirebase)
    this.fireBaseService.updateStudent(this.idUpdateFirebase, this.estudianteForm.value).then(resp => {
      this.estudianteForm.reset();
      this.modalService.dismissAll();
      console.log("update: "+this.idUpdateFirebase)
    }).catch(err => {
      console.error(err);
    })
  }

  delete(item:any):void {
    console.log(item.idFireBase);
    this.fireBaseService.deleteStudent(item.idFireBase)
  }

  open(content: any) {
    this.isEdit = false;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEdit(content: any, data: any) {
    this.isEdit = true;
    //Editar form
    this.estudianteForm.setValue({
      id: data.id,
      nombre: data.nombre,
      apellido: data.apellido
    });
    this.idUpdateFirebase = data.idFireBase;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


}
