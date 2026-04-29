import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // 1. Añade RouterModule aquí
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaService } from '../../services/sala.service';
import { AlertService } from '../../services/alert.service';

@Component({
  standalone: true,
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  imports: [CommonModule, FormsModule, RouterModule] // 2. AÑÁDELO AQUÍ
})
export class InicioComponent implements OnInit {

  codigoSala = '';
  salas: any[] = [];
  mostrarModal: boolean = false;
  nuevoNombreSala: string = '';
  codigoParaUnirme: string = '';

  constructor(private router: Router,
    private salasService: SalaService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.obtenerSalas();
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nuevoNombreSala = '';
  }

  confirmarCreacion() {
    const usuarioId = 1;
    this.salasService.crearSala(this.nuevoNombreSala, usuarioId).subscribe({
      next: (res: any) => {
        this.salas.push(res);
        this.cerrarModal();
        this.cdr.detectChanges();
        this.alertService.success("Sala creada correctamente");
        
      },
      error: (err: Error) => this.alertService.error('Error al crear la sala')
    });
  }


  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  obtenerSalas() {
    this.salasService.obtenerSalas(1).subscribe({
      next: (response: any) => {
        this.salas = response;
        this.cdr.detectChanges();
      }
    });
  }

  unirmeASala() {
    if (!this.codigoSala.trim()) {
      this.alertService.error('Debes introducir un código');
      return;
    }
    if(this.salas.filter(s => s.codSala?.trim() === this.codigoSala.trim())){
      this.alertService.error('Ya perteneces a esa sala');
      return;
    }
    const usuarioId = 1; // Provisional hasta tener el JWT

    this.salasService.unirse(this.codigoSala, usuarioId).subscribe({
      next: (salaUnida: any) => {
        // Añadimos la sala a la lista de "Mis salas" para que aparezca al momento
        this.salas.push(salaUnida);
        this.cdr.detectChanges();
        // Limpiamos el input y avisamos al usuario
        this.codigoSala = '';
        this.alertService.success(`¡Bienvenid@ a la sala ${salaUnida.nombre}!`);
      },
      error: (err: Error) => {
        // El error vendrá del Back (Sala llena o código inexistente)
        this.alertService.error('El código no es válido o la sala está llena');
      }
    });
  }

  entrarSala(salaId: number) {
    this.router.navigate(['/sala', salaId]);
  }
}
