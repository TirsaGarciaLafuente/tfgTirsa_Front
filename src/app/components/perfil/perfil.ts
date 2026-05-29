import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
  imports: [CommonModule, FormsModule]
})
export class PerfilComponent implements OnInit {
  
  @Output() cerrar = new EventEmitter<void>();
  @Input() userIdParaMostrar?: number;

  isEditing = false;
  mostrarModalAvatar = false;
  guardando = false;

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


  usuario: any = {
    id: '',
    avatar: '/assets/default-avatar.jpg',
    titulo: '',
    nombre: '',
    descripcion: ''
  };

  usuarioEdit: any = { ...this.usuario };

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { 
    this.cargarDatos(); 
  }

  cargarDatos(): void {
    if (this.userIdParaMostrar) {
      this.usuarioService.obtenerPerfilPorId(this.userIdParaMostrar).subscribe({
        next: (data) => this.procesarDatos(data),
        error: (err) => console.error('Error al cargar perfil ajeno:', err)
      });
    } else {
      this.usuarioService.obtenerPerfil().subscribe({
        next: (data) => this.procesarDatos(data),
        error: (err) => console.error('Error al cargar perfil propio:', err)
      });
    }
  }


  procesarDatos(data: any): void {
    if (data) {
      this.usuario = {
        id: data.id || '',
        avatar: data.avatar || '/assets/default-avatar.jpg',
        titulo: data.titulo || 'EL NOVATO',
        nombre: data.nombre || data.username || 'Usuario',
        descripcion: data.descripcion || 'Aún no hay descripción.'
      };
      this.usuarioEdit = { ...this.usuario };
      this.cdr.detectChanges();
    }
  }
  activarEdicion() {
    if (!this.userIdParaMostrar) {
      this.isEditing = true;
      this.usuarioEdit = { ...this.usuario };
    }
  }

  cancelarEdicion() {
    this.isEditing = false;
  }

  guardarPerfil() {
    this.guardando = true;

    const datosPerfil = {
      titulo: this.usuarioEdit.titulo,
      nombre: this.usuarioEdit.nombre,
      descripcion: this.usuarioEdit.descripcion
    };

    this.usuarioService.actualizarDatos(datosPerfil).subscribe({
      next: () => {
        if (this.usuarioEdit.avatar !== this.usuario.avatar) {
          this.usuarioService.actualizarAvatar(this.usuarioEdit.avatar).subscribe({
            next: () => this.finalizarGuardado(),
            error: (err: any) => this.gestionarError(err)
          });
        } else {
          this.finalizarGuardado();
        }
      },
      error: (err: any) => this.gestionarError(err)
    });
  }

  finalizarGuardado() {
    this.usuario = { ...this.usuarioEdit };
    this.isEditing = false;
    this.guardando = false;
    
    this.usuarioService.notificarCambio(); 
    
    this.cdr.detectChanges();
  }

  gestionarError(err: any) {
    console.error('Error al guardar:', err);
    alert('Hubo un problema al guardar los cambios en el servidor.');
    this.guardando = false;
  }

  abrirModalAvatar(): void {
    if (this.isEditing) {
      this.mostrarModalAvatar = true;
    }
  }

  cerrarModalAvatar(): void {
    this.mostrarModalAvatar = false;
  }

  seleccionarAvatar(nuevoAvatar: string): void {
  this.usuarioEdit.avatar = nuevoAvatar;
  
  this.cerrarModalAvatar();
  
  this.cdr.detectChanges();
}

  cerrarModal() {
    this.cerrar.emit();
  }
}