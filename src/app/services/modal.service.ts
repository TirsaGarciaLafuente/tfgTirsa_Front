import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  mostrar = false;
  usuarioId: number | null = null;


abrirPerfil(id: number) {

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