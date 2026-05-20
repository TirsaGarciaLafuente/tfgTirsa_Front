import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  private apiUrl = 'http://localhost:8080/api/mensajes';

  constructor(private http: HttpClient) { }

  obtenerHistorial(salaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial/${salaId}`);
  }

  enviarMensaje(salaId: number, texto: string): Observable<any> {
    const params = new HttpParams()
      .set('salaId', salaId.toString())
      .set('texto', texto);

    return this.http.post<any>(`${this.apiUrl}/enviar`, null, { params });
  }
}