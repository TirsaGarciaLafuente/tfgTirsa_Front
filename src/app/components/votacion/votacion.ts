import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // IMPRESCINDIBLE para usar *ngIf y *ngFor en el HTML
import { VotacionService } from '../../services/votacion.service';

@Component({
  selector: 'app-votacion',
  standalone: true, // Indica que es un componente independiente
  imports: [CommonModule], // Importamos CommonModule para que el HTML entienda las directivas de Angular
  templateUrl: './votacion.html', // Ajustado a tus nombres de archivo exactos
  styleUrl: './votacion.css',
})
export class Votacion implements OnInit {

  salaId!: number;
  preguntaDelDia: any = null;
  companeros: any[] = []; 
  cargando: boolean = true;
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(
    private route: ActivatedRoute,
    private votacionService: VotacionService
  ) { }

  ngOnInit(): void {
    // Capturamos el ID de la sala desde la URL (ej: /sala/3/votacion)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.salaId = +idParam;
      this.cargarVotacionDiaria();
    }
  }

  cargarVotacionDiaria(): void {
    this.cargando = true;
    this.votacionService.obtenerPreguntaDelDia(this.salaId).subscribe({
      next: (data) => {
        if (data && data.id) {
          this.preguntaDelDia = data;
          this.obtenerCompanerosSala(); 
        } else {
          this.mensajeError = data.mensaje || 'No hay preguntas disponibles para hoy.';
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mensajeError = 'Error al conectar con el servidor de votaciones.';
        this.cargando = false;
      }
    });
  }

  obtenerCompanerosSala(): void {
    // Temporalmente vacío hasta que conectemos la lista de usuarios de la sala
    this.companeros = []; 
  }

  emitirVoto(usuarioId: number): void {
    this.votacionService.votar(usuarioId, this.preguntaDelDia.id).subscribe({
      next: (res) => {
        this.mensajeExito = '¡Tu voto ha sido registrado correctamente!';
        this.mensajeError = '';
      },
      error: (err) => {
        if (err.error && err.error.error) {
          this.mensajeError = err.error.error;
        } else {
          this.mensajeError = 'No se ha podido registrar el voto.';
        }
        this.mensajeExito = '';
      }
    });
  }
}