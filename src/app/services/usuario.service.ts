import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Ajusta esta URL a la dirección de tu backend
  private urlBackend = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) { }

  // Método para actualizar el avatar
  actualizarAvatar(nuevoAvatar: string): Observable<any> {
    return this.http.put(`${this.urlBackend}/usuarios/avatar`, { avatar: nuevoAvatar }, { responseType: 'text' });
  }

  // Método para obtener los datos del usuario (incluyendo el avatar)
  obtenerPerfil(): Observable<any> {
    return this.http.get(`${this.urlBackend}/usuarios/perfil`);
  }
}