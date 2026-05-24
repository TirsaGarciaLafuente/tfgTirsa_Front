import { ChangeDetectorRef, Component, OnInit } from '@angular/core'; // Añadimos OnInit
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service'; // Importa tu nuevo servicio

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [CommonModule, FormsModule, RouterModule]
})
export class HeaderComponent implements OnInit { // Implementamos OnInit

  constructor(
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService, // Inyectamos el servicio
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Al cargar el header, pedimos el perfil al backend para obtener el avatar guardado
    this.usuarioService.obtenerPerfil().subscribe({
      next: (usuario) => {
        if (usuario && usuario.avatar) {
          this.avatarActual = usuario.avatar;
        }
      },
      error: (err) => console.error('Error al cargar perfil:', err)
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // --- Lógica del Selector de Avatares ---
  mostrarModalAvatar: boolean = false;
  
  avatarActual: string = '/assets/avatar-default.jpg'; 
  
  avataresDisponibles: string[] = [
    '/assets/avatar1.jpg',
    '/assets/avatar2.jpg',
    '/assets/avatar3.jpg',
    '/assets/avatar4.jpg',
    '/assets/avatar5.jpg',
    '/assets/avatar6.jpg',
    '/assets/avatar7.jpg',
    '/assets/avatar8.jpg',
  ];

  abrirModalAvatar(): void {
    this.mostrarModalAvatar = true;
  }

  cerrarModalAvatar(): void {
    this.mostrarModalAvatar = false;
  }

  seleccionarAvatar(nuevoAvatar: string): void {
    // Llamamos al servicio para persistir el cambio en la BD
    this.usuarioService.actualizarAvatar(nuevoAvatar).subscribe({
      next: () => {
        // Solo actualizamos la vista si el backend confirma el éxito
        this.avatarActual = nuevoAvatar;
        this.cerrarModalAvatar();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al guardar el avatar en la base de datos', err);
        alert('Hubo un problema al actualizar tu avatar');
      }
    });
  }
}