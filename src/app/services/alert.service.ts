import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // Alerta de éxito
  success(mensaje: string) {
    Swal.fire({
      title: '¡Hecho!',
      text: mensaje,
      icon: 'success',
      confirmButtonColor: '#d4845a', // El naranja de tu login
      confirmButtonText: 'Genial'
    });
  }

  // Alerta de error
  error(mensaje: string) {
    Swal.fire({
      title: 'Ups...',
      text: mensaje,
      icon: 'error',
      confirmButtonColor: '#d4845a'
    });
  }

  // Alerta de carga (útil mientras esperas al servidor)
  loading() {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  close() {
    Swal.close();
  }
}