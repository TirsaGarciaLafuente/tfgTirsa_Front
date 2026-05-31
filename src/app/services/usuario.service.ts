import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private urlBackend = 'https://tfgtirsa-back.onrender.com/api';

  private perfilActualizado = new Subject<void>();
  perfilActualizado$ = this.perfilActualizado.asObservable();

  constructor(private http: HttpClient) { }

  notificarCambio() {
    this.perfilActualizado.next();
  }


  obtenerPerfilPorId(id: number): Observable<any> {
    return this.http.get(`${this.urlBackend}/usuarios/perfil/${id}`);
  }

  actualizarAvatar(nuevoAvatar: string): Observable<any> {
    return this.http.put(`${this.urlBackend}/usuarios/avatar`, { avatar: nuevoAvatar }, { responseType: 'text' });
  }

  obtenerPerfil(): Observable<any> {
    return this.http.get(`${this.urlBackend}/usuarios/perfil`);
  }

  actualizarDatos(datos: any): Observable<any> {
    return this.http.put(`${this.urlBackend}/usuarios/perfil`, datos, { responseType: 'text' });
  }
}