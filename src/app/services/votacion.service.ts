import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResultadoVotacion {
  nombre: string;
  votos: number;
  porcentaje: number;
}

@Injectable({
  providedIn: 'root'
})
export class VotacionService {
  private apiUrl = 'https://breakroom-backend.onrender.com/api/votaciones';

  constructor(private http: HttpClient) {}

  obtenerPreguntaDelDia(salaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pregunta-del-dia/${salaId}`);
  }

  votar(preguntaId: number, votadoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/votar`, { preguntaId, votadoId });
  }

  verificarVoto(preguntaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/verificar-voto/${preguntaId}`);
  }

  obtenerResultados(preguntaId: number): Observable<ResultadoVotacion[]> {
    return this.http.get<ResultadoVotacion[]>(`${this.apiUrl}/resultados/${preguntaId}`);
  }
}