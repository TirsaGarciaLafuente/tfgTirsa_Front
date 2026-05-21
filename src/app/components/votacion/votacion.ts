import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { VotacionService } from '../../services/votacion.service';
import { SalaService } from '../../services/sala.service'; // 1. IMPORTAMOS EL SERVICIO DE SALAS

@Component({
  selector: 'app-votacion',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './votacion.html', 
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
    private votacionService: VotacionService,
    private salaService: SalaService // 2. INYECTAMOS EL SERVICIO DE SALAS
  ) { }

  ngOnInit(): void {
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
          this.obtenerCompanerosSala(); // Si hay pregunta, buscamos los compañeros
        } else {
          this.mensajeError = data.mensaje || 'No hay preguntas disponibles para hoy.';
          this.cargando = false;
        }
      },
      error: (err) => {
        this.mensajeError = 'Error al conectar con el servidor de votaciones.';
        this.cargando = false;
      }
    });
  }

  obtenerCompanerosSala(): void {
    // 3. LLAMAMOS AL SERVICIO DE SALAS PARA TRAER LOS MIEMBROS REALES
    this.salaService.obtenerSalaPorId(this.salaId).subscribe({
      next: (sala) => {
        // Asumiendo que tu objeto Sala tiene una lista llamada 'usuarios' o 'miembros'
        // Revisa cómo se llama el atributo en tu entidad Sala de Java (ej: sala.usuarios)
        if (sala && sala.usuarios) {
          this.companeros = sala.usuarios; 
        }
        this.cargando = false;
      },
      error: (err) => {
        this.mensajeError = 'Error al cargar los compañeros de la sala.';
        this.cargando = false;
      }
    });
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