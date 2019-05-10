import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../_service/producto.service';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Producto } from './../../_model/producto';
import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  displayedColumns = ['id', 'nombres', 'marca','acciones'];
  dataSource: MatTableDataSource<Producto>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  
  constructor(private productoService: ProductoService, private snackBar: MatSnackBar, public route: ActivatedRoute) { }

  ngOnInit() {
    this.productoService.productoCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.productoService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'Aviso', {
        duration: 2000,
      });
    });

    this.productoService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  eliminar(idProducto: number) {
    this.productoService.eliminar(idProducto).subscribe(data => {
      this.productoService.listar().subscribe(data => {
        this.productoService.productoCambio.next(data);
        this.productoService.mensajeCambio.next('Se eliminó');
      });
    });
  }
}
