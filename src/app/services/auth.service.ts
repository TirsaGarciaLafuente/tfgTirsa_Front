import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Importante importar tap para el JWT

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Separamos las rutas según el controlador de Spring Boot
  private authUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  // ─── MÉTODO LOGIN ACTUALIZADO CON JWT ───
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, credentials)
      .pipe(
        tap(response => {
          // Si el servidor devuelve un token, lo guardamos en el navegador
          if (response && response.jwt) {
            localStorage.setItem('token', response.jwt);
            localStorage.setItem('usuario', credentials.nombre);
          }
        })
      );
  }

  // ─── TUS MÉTODOS ANTERIORES INTACTOS ───
  registro(credentials: any): Observable<any> {
    return this.http.post(`${this.authUrl}/registro`, credentials);
  }

  verificarUsuario(data: any): Observable<any> {
    return this.http.post(`${this.authUrl}/verificar`, data);
  }

  cambiarPassword(data: any): Observable<any> {
    return this.http.post(`${this.authUrl}/cambiar-password`, data);
  }

  // ─── NUEVOS MÉTODOS DE UTILIDAD PARA SESIÓN ───
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
}