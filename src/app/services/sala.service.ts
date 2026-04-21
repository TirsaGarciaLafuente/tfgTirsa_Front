import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
  // La URL de tu controlador de Spring
  private apiUrl = 'http://localhost:8080/api/salas';

  constructor(private http: HttpClient) { }

  obtenerSalas(idUsuario: number): Observable<any> {
    return this.http.get(this.apiUrl +'/usuario/' + idUsuario,);
  }

  /**
   * Crea una nueva sala.
   */
  crearSala(nombre: string, usuarioId: number): Observable<any> {
    // Como tu controller usa @RequestParam, los mandamos en la URL
    return this.http.post<any>(`${this.apiUrl}/crear?nombre=${nombre}&usuarioId=${usuarioId}`, {});
  }

    /**
   * Crea una nueva sala.
   */
  unirse(nombre: string, usuarioId: number): Observable<any> {
    // Como tu controller usa @RequestParam, los mandamos en la URL
    return this.http.post<any>(`${this.apiUrl}/unirse?codSala=${nombre}&usuarioId=${usuarioId}`, {});
  }


}