import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators'; // Importante importar tap para el JWT

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Separamos las rutas según el controlador de Spring Boot
  private authUrl = 'http://localhost:8080/api/auth';

  public loginSuccess$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  // ─── MÉTODO LOGIN ACTUALIZADO CON JWT ───
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, credentials);
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

  // En auth.service.ts

  obtenerIdUsuarioLogueado(): number | null {
    // Cambia 'token' por el nombre exacto que uses en tu localStorage
    const token = localStorage.getItem('token'); 
    
    if (!token) return null;

    try {
      // El JWT tiene 3 partes separadas por puntos. El índice 1 es el payload.
      const payloadBase64 = token.split('.')[1];
      
      // Decodificamos la base64 a texto
      const decodedJson = atob(payloadBase64);
      
      // Lo convertimos en un objeto de JavaScript
      const valores = JSON.parse(decodedJson);
      
      // IMPORTANTE: Cambia 'valores.id' por el nombre de la propiedad 
      // exacta que tu backend (Spring Boot) guarda en el token. 
      // A veces es valores.sub, valores.userId, etc.
      return valores.id; 
      
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
}