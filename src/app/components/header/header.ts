import { ChangeDetectorRef, Component, OnInit } from '@angular/core'; 
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service'; 
import { PerfilComponent } from '../perfil/perfil';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [CommonModule, FormsModule, RouterModule, PerfilComponent]
})
export class HeaderComponent implements OnInit { 

  // --- Variable para el Modo Oscuro ---
  isDarkMode = false;

  // --- Lógica del Selector de Avatares ---
  mostrarModalAvatar: boolean = false;
  avatarActual: string = '/assets/default-avatar.jpg'; 

  constructor(
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService, 
    private cdr: ChangeDetectorRef
  ) { }

  // ... tus otros imports ...

  ngOnInit(): void {
    // 1. Comprobar preferencia de Modo Oscuro
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.setAttribute('data-theme', 'dark');
    }

    // 2. Cargar avatar inicial
    if (localStorage.getItem('token')) {
      this.cargarAvatar();
    }

    // 3. Suscripciones para actualizar el avatar
    this.authService.loginSuccess$.subscribe(() => {
      this.cargarAvatar();
    });

    // --- NUEVA LÍNEA: Escucha cuando el Perfil avisa de un cambio ---
    this.usuarioService.perfilActualizado$.subscribe(() => {
      this.cargarAvatar();
    });
  }

// ... resto de tu código ...

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

  cargarAvatar(): void {
    this.usuarioService.obtenerPerfil().subscribe({
      next: (usuario) => {
        if (usuario && usuario.avatar) {
          this.avatarActual = usuario.avatar;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error al cargar perfil:', err)
    });
  }

  estaLogueado(): boolean {
    return localStorage.getItem('token') !== null;
  }
  
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  abrirModalAvatar(): void {
    this.mostrarModalAvatar = true;
  }

  cerrarModalAvatar(): void {
    this.mostrarModalAvatar = false;
  }
}