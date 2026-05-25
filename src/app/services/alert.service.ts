import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // Alerta de éxito (Se cierra sola, sin botón)
  success(mensaje: string) {
    Swal.fire({
      title: '¡Hecho!',
      text: mensaje,
      icon: 'success',
      showConfirmButton: false, // Oculta el botón
      timer: 1500, // Tiempo en milisegundos (1.5 segundos)
      background: '#FFF5E4',
      color: '#2B2B2B',
      customClass: {
        popup: 'brutal-swal-popup'
      }
    });
  }

  // Alerta de error (Mantiene el botón para que el usuario pueda leer el error)
  error(mensaje: string) {
    Swal.fire({
      title: 'Ups...',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#000000', 
      background: '#FFF5E4',
      color: '#2B2B2B',
      customClass: {
        popup: 'brutal-swal-popup',
        confirmButton: 'brutal-swal-button'
      }
    });
  }

  // NUEVA: Alerta de confirmación para abandonar la sala
  confirmarAbandono(): Promise<any> {
    return Swal.fire({
      title: '¿Seguro que quieres abandonar esta sala?',
      text: 'Para volver a entrar, necesitarás ingresar el código de nuevo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Abandonar',
      cancelButtonText: 'Quedarme',
      reverseButtons: true, // Coloca 'Quedarme' a la izquierda y 'Abandonar' a la derecha
      background: '#FFF5E4',
      color: '#2B2B2B',
      customClass: {
        popup: 'brutal-swal-popup',
        confirmButton: 'brutal-swal-button brutal-btn-danger',
        cancelButton: 'brutal-swal-button brutal-btn-safe'
      }
    });
  }

  // Alerta de carga
  loading() {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      background: '#FFF5E4',
      color: '#2B2B2B',
      customClass: {
        popup: 'brutal-swal-popup'
      },
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  close() {
    Swal.close();
  }
}