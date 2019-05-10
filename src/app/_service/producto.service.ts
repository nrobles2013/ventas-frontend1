import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../_model/producto';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  productoCambio = new Subject<Producto[]>();
  mensajeCambio = new Subject<string>();
  url: string = `${environment.HOST_URL}/productos`;

  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<Producto[]>(this.url);
  }

  listarPorId(idProducto: number) {
    return this.http.get<Producto>(`${this.url}/${idProducto}`);
  }

  registrar(producto: Producto) {
    return this.http.post(`${this.url}`, producto);
  }

  modificar(producto: Producto) {
    return this.http.put(`${this.url}`, producto);
  }

  eliminar(idProducto: number) {
    return this.http.delete(`${this.url}/${idProducto}`);
  }
}
