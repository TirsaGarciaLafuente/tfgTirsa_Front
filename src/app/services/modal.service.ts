import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  mostrar = false;
  usuarioId: number | null = null;

  // En src/services/modal.service.ts
abrirPerfil(id: number) {
  // Verificación básica: si no hay token, no abrimos nada (o redirigimos al login)
  if (!localStorage.getItem('token')) {
    console.warn("Usuario no autenticado");
    return;
  }
  this.usuarioId = id;
  this.mostrar = true;
}

  cerrar() {
    this.mostrar = false;
    this.usuarioId = null;
  }
}