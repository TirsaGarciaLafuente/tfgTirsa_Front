import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs'; // Asegúrate de tener Subject aquí

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private urlBackend = 'http://localhost:8080/api';

  // 1. Emisor de eventos para avisar al Header
  private perfilActualizado = new Subject<void>();
  perfilActualizado$ = this.perfilActualizado.asObservable();

  constructor(private http: HttpClient) { }

  // 2. Método para disparar el aviso
  notificarCambio() {
    this.perfilActualizado.next();
  }

  // --- MÉTODOS DE API ---

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