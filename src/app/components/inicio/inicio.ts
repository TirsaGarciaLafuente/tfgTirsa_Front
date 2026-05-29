import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaService } from '../../services/sala.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../header/header';

@Component({
  standalone: true,
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  imports: [CommonModule, FormsModule, RouterModule]
})
export class InicioComponent implements OnInit {

  // --- Variable para el Modo Oscuro ---
  isDarkMode = false;

  codigoSala = '';
  salas: any[] = [];
  mostrarModal: boolean = false;
  nuevoNombreSala: string = '';
  codigoParaUnirme: string = '';

  constructor(private router: Router,
    private salasService: SalaService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    // 1. Sincroniza el icono del botón con el estado actual del tema
    if (localStorage.getItem('theme') === 'dark') {
      this.isDarkMode = true;
    }

    // 2. Carga las salas del usuario
    this.obtenerSalas();
  }

  // --- Función para cambiar el tema ---
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nuevoNombreSala = '';
  }

  confirmarCreacion() {
    this.salasService.crearSala(this.nuevoNombreSala).subscribe({
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
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  obtenerSalas() {
    this.salasService.obtenerSalas().subscribe({
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
    if(this.salas.length > 0 && this.salas.filter(s => s.codSala?.trim() === this.codigoSala.trim()).length > 0){
      this.alertService.error('Ya perteneces a esa sala');
      return;
    }

    this.salasService.unirse(this.codigoSala).subscribe({
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

  confirmarYAbandonar(salaId: string) {
    this.alertService.confirmarAbandono().then((result) => {
      if (result.isConfirmed) {
        this.salasService.abandonarSala(salaId).subscribe({
          next: () => {
            this.salas = this.salas.filter(s => s.id !== salaId);
            this.cdr.detectChanges();
            this.alertService.success('Has abandonado la sala correctamente');
          },
          error: (err: any) => {
            console.error('Error al abandonar la sala:', err);
            this.alertService.error('No se pudo procesar la solicitud. Inténtalo de nuevo.');
          }
        });
      }
    });
  }
}