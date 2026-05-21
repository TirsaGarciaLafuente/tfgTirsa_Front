import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VotacionService {

  // URL base de nuestro controlador de votaciones en Spring Boot
  private apiUrl = 'http://localhost:8080/api/votaciones';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la pregunta activa del día para una sala concreta.
   * @param salaId ID de la sala actual
   */
  obtenerPreguntaDelDia(salaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/sala/${salaId}`);
  }

  /**
   * Registra el voto del usuario actual hacia un compañero.
   * @param votadoId ID del usuario al que se vota
   * @param preguntaId ID de la pregunta del día
   */
  votar(votadoId: number, preguntaId: number): Observable<any> {
    // Configuramos los parámetros ?votadoId=X&preguntaId=Y que pide el @RequestParam del backend
    const params = new HttpParams()
      .set('votadoId', votadoId.toString())
      .set('preguntaId', preguntaId.toString());

    // Enviamos la petición POST. El token JWT se adjuntará automáticamente 
    // si tienes configurado un interceptor en tu proyecto de Angular.
    return this.http.post(`${this.apiUrl}/votar`, {}, { params });
  }
}