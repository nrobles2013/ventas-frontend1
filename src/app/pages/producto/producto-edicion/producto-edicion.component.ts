import { ActivatedRoute, Router, Params } from '@angular/router';
import { ProductoService } from '../../../_service/producto.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Producto } from './../../../_model/producto';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-producto-edicion',
  templateUrl: './producto-edicion.component.html',
  styleUrls: ['./producto-edicion.component.css']
})
export class ProductoEdicionComponent implements OnInit {

  id: number;
  producto: Producto;
  form: FormGroup;
  edicion: boolean = false;

  constructor(private productoService: ProductoService, private route: ActivatedRoute, private router: Router) {    
  }

  ngOnInit() {
    
    this.producto = new Producto();
    
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'marca': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });
  }

  initForm(){
    if (this.edicion) {
      this.productoService.listarPorId(this.id).subscribe(data => {
        let id = data.idProducto;
        let nombres = data.nombres;
        let marca = data.marca;
        this.form = new FormGroup({
          'id': new FormControl(id),
          'nombres': new FormControl(nombres),
          'marca': new FormControl(marca)
        });
      });
    }
  }

  operar() {
    this.producto.idProducto = this.form.value['id'];
    this.producto.nombres = this.form.value['nombres'];
    this.producto.marca = this.form.value['marca'];

    if (this.producto != null && this.producto.idProducto > 0) {
      this.productoService.modificar(this.producto).subscribe(data => {
        this.productoService.listar().subscribe(producto => {
          this.productoService.productoCambio.next(producto);
          this.productoService.mensajeCambio.next("Se modificó");
        });
      });
    } else {
      this.productoService.registrar(this.producto).subscribe(data => {        
        this.productoService.listar().subscribe(especialidad => {
          this.productoService.productoCambio.next(especialidad);
          this.productoService.mensajeCambio.next("Se registró");
        });
      });
    }

    this.router.navigate(['producto']);
  }

}
