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

  obtenerSalas(): Observable<any> {
    return this.http.get(this.apiUrl +'/usuario',);
  }

  /**
   * Crea una nueva sala.
   */
  crearSala(nombre: string): Observable<any> {
    // Como tu controller usa @RequestParam, los mandamos en la URL
    return this.http.post<any>(`${this.apiUrl}/crear?nombre=${nombre}`, {});
  }

    /**
   * Crea una nueva sala.
   */
  unirse(nombre: string): Observable<any> {
    // Como tu controller usa @RequestParam, los mandamos en la URL
    return this.http.post<any>(`${this.apiUrl}/unirse?codSala=${nombre}`, {});
  }

  /**
   * Obtiene los detalles de una sala específica, incluyendo sus miembros.
   * @param salaId ID de la sala
   */
  obtenerSalaPorId(salaId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${salaId}`);
  }

  abandonarSala(salaId: string | number) {
    // Si tu interceptor ya añade el token automáticamente, solo necesitas hacer esto:
    return this.http.delete(`${this.apiUrl}/${salaId}/abandonar`);
  }

}