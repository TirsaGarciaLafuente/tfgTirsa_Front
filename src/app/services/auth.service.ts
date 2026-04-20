import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // La URL de tu controlador de Spring
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl + "/login", credentials);
  }

  registro(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl + "/registro", credentials);
  }

  verificarUsuario(data: { email: string, username: string }): Observable<any> {
    return this.http.post(this.apiUrl + '/verificar', data);
  }

  cambiarPassword(data: { email: string, username: string, password: string }): Observable<any> {
    return this.http.post(this.apiUrl +'/cambiar-password', data);
  }
}