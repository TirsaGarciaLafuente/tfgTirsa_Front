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

  isDarkMode = false;

  mostrarModalAvatar: boolean = false;
  avatarActual: string = 'assets/default-avatar.jpg'; 

  constructor(
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService, 
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.setAttribute('data-theme', 'dark');
    }

    if (localStorage.getItem('token')) {
      this.cargarAvatar();
    }

    this.authService.loginSuccess$.subscribe(() => {
      this.cargarAvatar();
    });

    this.usuarioService.perfilActualizado$.subscribe(() => {
      this.cargarAvatar();
    });
  }


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