import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GaleriaService {
  private apiUrl = 'http://localhost:8080/api/galeria';

  constructor(private http: HttpClient) {}

  obtenerImagenes(salaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sala/${salaId}`);
  }

  subirImagen(imagenData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/subir`, imagenData);
  }
}