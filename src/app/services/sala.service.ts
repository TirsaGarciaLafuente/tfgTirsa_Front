import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
  private apiUrl = 'http://localhost:8080/api/salas';

  constructor(private http: HttpClient) { }

  obtenerSalas(): Observable<any> {
    return this.http.get(this.apiUrl +'/usuario',);
  }

  crearSala(nombre: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear?nombre=${nombre}`, {});
  }

  unirse(nombre: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/unirse?codSala=${nombre}`, {});
  }

  obtenerSalaPorId(salaId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${salaId}`);
  }

  abandonarSala(salaId: string | number) {
    return this.http.delete(`${this.apiUrl}/${salaId}/abandonar`);
  }

}