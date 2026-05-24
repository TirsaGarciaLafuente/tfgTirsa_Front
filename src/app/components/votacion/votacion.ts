import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { VotacionService } from '../../services/votacion.service';
import { SalaService } from '../../services/sala.service'; 

@Component({
  selector: 'app-votacion',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
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
  
  // Nuevas variables para el control de la gráfica
  haVotado: boolean = false;
  resultados: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private votacionService: VotacionService,
    private salaService: SalaService, 
    private cdr: ChangeDetectorRef
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
          this.mensajeError = ''; 
          this.obtenerCompanerosSala(); 
          this.verificarSiHaVotado();
        } else {
          this.mensajeError = data.mensaje || 'No hay preguntas disponibles para esta sala.';
          this.preguntaDelDia = null;
          this.cargando = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.mensajeError = 'Error al conectar con el servidor de votaciones.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  obtenerCompanerosSala(): void {
    this.salaService.obtenerSalaPorId(this.salaId).subscribe({
      next: (sala) => {
        if (sala && sala.usuarios) {
          this.companeros = sala.usuarios; 
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mensajeError = 'Error al cargar los compañeros de la sala.';
        this.cdr.detectChanges();
      }
    });
  }

  verificarSiHaVotado(): void {
    this.votacionService.verificarVoto(this.preguntaDelDia.id).subscribe({
      next: (res: any) => {
        this.haVotado = res.haVotado;
        if (this.haVotado) {
          this.cargarResultados();
        } else {
          this.cargando = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error al verificar el estado del voto', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  emitirVoto(usuarioId: number): void {
    // Se envía el ID de la pregunta y el ID del compañero seleccionado
    this.votacionService.votar(this.preguntaDelDia.id, usuarioId).subscribe({
      next: () => {
        this.mensajeExito = '¡Tu voto ha sido registrado correctamente!';
        this.mensajeError = '';
        this.haVotado = true;
        this.cargarResultados();
      },
      error: (err) => {
        if (err.error && err.error.error) {
          this.mensajeError = err.error.error;
        } else {
          this.mensajeError = 'No se ha podido registrar el voto.';
        }
        this.mensajeExito = '';
        this.cdr.detectChanges();
      }
    });
  }

  cargarResultados(): void {
    this.votacionService.obtenerResultados(this.preguntaDelDia.id).subscribe({
      next: (data) => {
        // Ordenación de mayor a menor porcentaje para la visualización
        this.resultados = data.sort((a, b) => b.porcentaje - a.porcentaje);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar los resultados de la votación', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}