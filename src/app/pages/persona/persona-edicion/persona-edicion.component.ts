import { ActivatedRoute, Router, Params } from '@angular/router';
import { PersonaService } from '../../../_service/persona.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Persona } from './../../../_model/persona';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-persona-edicion',
  templateUrl: './persona-edicion.component.html',
  styleUrls: ['./persona-edicion.component.css']
  
})
export class PersonaEdicionComponent implements OnInit {

  id: number;
  persona: Persona;
  form: FormGroup;
  edicion: boolean = false;

  constructor(private personaService: PersonaService, private route: ActivatedRoute, private router: Router) {    
  }

  ngOnInit() {
    
    this.persona = new Persona();
    
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm(){
    if (this.edicion) {
      this.personaService.listarPorId(this.id).subscribe(data => {
        let id = data.idPersona;
        let nombres = data.nombres;
        let apellidos = data.apellidos;
        this.form = new FormGroup({
          'id': new FormControl(id),
          'nombres': new FormControl(nombres),
          'apellidos': new FormControl(apellidos)
        });
      });
    }
  }

  operar() {
    this.persona.idPersona = this.form.value['id'];
    this.persona.nombres = this.form.value['nombres'];
    this.persona.apellidos = this.form.value['apellidos'];

    if (this.persona != null && this.persona.idPersona > 0) {
      this.personaService.modificar(this.persona).subscribe(data => {
        this.personaService.listar().subscribe(persona => {
          this.personaService.personaCambio.next(persona);
          this.personaService.mensajeCambio.next("Se modificó");
        });
      });
    } else {
      this.personaService.registrar(this.persona).subscribe(data => {        
        this.personaService.listar().subscribe(persona => {
          this.personaService.personaCambio.next(persona);
          this.personaService.mensajeCambio.next("Se registró");
        });
      });
    }

    this.router.navigate(['persona']);
  }

}
