import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MensajeService } from '../../services/mensaje.service';

@Component({
  standalone: true,
  selector: 'app-sala-detalle',
  // Asegúrate de que los nombres de los archivos HTML y CSS coinciden con los que tienes creados
  templateUrl: './sala-detalle.html', 
  styleUrl: './sala-detalle.css',
  imports: [CommonModule, FormsModule, RouterModule]
})
export class SalaDetalleComponent implements OnInit {
  
  salaId!: number;
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  // Usamos el ID 1 temporalmente hasta que tengas implementado el token del login
  usuarioIdProvisional: number = 2; 

  vistaActual: string = 'muro';

  constructor(
    private route: ActivatedRoute, // Para leer la URL
    private mensajeService: MensajeService, // Para llamar al backend
    private cdr: ChangeDetectorRef // Para que el html detecte cambios
  ) {}

  ngOnInit(): void {
    // Leer el ID de la sala que viene en la URL (ej: /sala/5)
    this.salaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.mensajeService.obtenerHistorial(this.salaId).subscribe({
      next: (historial) => {
        this.mensajes = historial;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar mensajes', err)
    });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return; // No enviar mensajes vacíos

    this.mensajeService.enviarMensaje(this.salaId, this.usuarioIdProvisional, this.nuevoMensaje).subscribe({
      next: (mensajeGuardado) => {
        // Añadimos el mensaje nuevo a la lista visual
        this.mensajes.push(mensajeGuardado);
        // Limpiamos la caja de texto
        this.nuevoMensaje = '';
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al enviar mensaje', err)
    });
  }
}