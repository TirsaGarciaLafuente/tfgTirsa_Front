import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:8080/api/auth';

  public loginSuccess$ = new Subject<void>();

  constructor(private http: HttpClient) { }


  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, credentials);
  }

  registro(credentials: any): Observable<any> {
    return this.http.post(`${this.authUrl}/registro`, credentials);
  }

  verificarUsuario(data: any): Observable<any> {
    return this.http.post(`${this.authUrl}/verificar`, data);
  }

  cambiarPassword(data: any): Observable<any> {
    return this.http.post(`${this.authUrl}/cambiar-password`, data);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuarioActual(): string | null {
    return localStorage.getItem('usuario');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }



  obtenerIdUsuarioLogueado(): number | null {
    const token = localStorage.getItem('token');

    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];


      const decodedJson = atob(payloadBase64);


      const valores = JSON.parse(decodedJson);

      return valores.id;

    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
}