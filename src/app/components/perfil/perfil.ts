import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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
  
  // Añade este evento para comunicarse con el header
  @Output() cerrar = new EventEmitter<void>();

  isEditing = false;
  mostrarModalAvatar = false;

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

  usuario = {
    avatar: '/assets/default-avatar.jpg',
    titulo: '',
    nombre: '',
    descripcion: ''
  };

  usuarioEdit = { ...this.usuario };

    constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService, // Inyectamos el servicio
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { this.cargarAvatar() }

    cargarAvatar(): void {
    this.usuarioService.obtenerPerfil().subscribe({
      next: (usuario) => {
        if (usuario ) {
          this.usuario = usuario;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error al cargar perfil:', err)
    });
  }

  activarEdicion() {
    this.isEditing = true;
    this.usuarioEdit = { ...this.usuario };
  }

  cancelarEdicion() {
    this.isEditing = false;
  }

  guardarPerfil() {
    this.usuario = { ...this.usuarioEdit };
    this.isEditing = false;
  }

    abrirModalAvatar(): void {
    this.mostrarModalAvatar = true;
  }

  cerrarModalAvatar(): void {
    this.mostrarModalAvatar = false;
  }
  // Nueva función para cerrar el modal
  cerrarModal() {
    this.cerrar.emit();
  }

    seleccionarAvatar(nuevoAvatar: string): void {
    // Llamamos al servicio para persistir el cambio en la BD
    this.usuarioService.actualizarAvatar(nuevoAvatar).subscribe({
      next: () => {
        // Solo actualizamos la vista si el backend confirma el éxito
        this.usuario.avatar = nuevoAvatar;
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