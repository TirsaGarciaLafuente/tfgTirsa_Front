import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private urlBackend = 'http://localhost:8080/api';

  private perfilActualizado = new Subject<void>();
  perfilActualizado$ = this.perfilActualizado.asObservable();

  constructor(private http: HttpClient) { }

  notificarCambio() {
    this.perfilActualizado.next();
  }

  // --- MÉTODOS DE API ---

  // NUEVO MÉTODO PARA OBTENER PERFIL POR ID
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