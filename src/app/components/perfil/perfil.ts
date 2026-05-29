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
  
  @Output() cerrar = new EventEmitter<void>();

  isEditing = false;
  mostrarModalAvatar = false;
  guardando = false; // Útil para desactivar el botón de guardar mientras carga

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

  // Estructura base
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
    this.usuarioService.obtenerPerfil().subscribe({
      next: (data) => {
        if (data) {
          // Cargamos los datos reales o aplicamos valores por defecto si están vacíos
          this.usuario = {
            id: data.id || '',
            avatar: data.avatar || '/assets/default-avatar.jpg',
            titulo: data.titulo || 'EL NOVATO',
            nombre: data.nombre || data.username || 'Usuario',
            descripcion: data.descripcion || 'Aún no hay descripción. Pulsa modificar para añadir una.'
          };
          this.usuarioEdit = { ...this.usuario };
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
    this.guardando = true;

    // 1. Datos a enviar al endpoint /usuarios/perfil
    const datosPerfil = {
      titulo: this.usuarioEdit.titulo,
      nombre: this.usuarioEdit.nombre,
      descripcion: this.usuarioEdit.descripcion
    };

    // 2. Primero actualizamos los datos de texto
    this.usuarioService.actualizarDatos(datosPerfil).subscribe({
      next: () => {
        // 3. Si los datos se guardaron, verificamos si el avatar cambió
        if (this.usuarioEdit.avatar !== this.usuario.avatar) {
          this.usuarioService.actualizarAvatar(this.usuarioEdit.avatar).subscribe({
            next: () => this.finalizarGuardado(),
            error: (err: any) => this.gestionarError(err)
          });
        } else {
          // Si el avatar no cambió, terminamos aquí
          this.finalizarGuardado();
        }
      },
      error: (err: any) => this.gestionarError(err)
    });
  }

  // Helper para limpiar el estado al finalizar
  finalizarGuardado() {
    this.usuario = { ...this.usuarioEdit };
    this.isEditing = false;
    this.guardando = false;
    
    // AQUÍ ES DONDE ESTÁ LA MAGIA: Avisamos a toda la app
    this.usuarioService.notificarCambio(); 
    
    this.cdr.detectChanges();
  }

  // Helper para manejar errores
  gestionarError(err: any) {
    console.error('Error al guardar:', err);
    alert('Hubo un problema al guardar los cambios en el servidor.');
    this.guardando = false;
  }

  abrirModalAvatar(): void {
    // Solo permitimos abrir el menú de avatares si estamos en modo edición
    if (this.isEditing) {
      this.mostrarModalAvatar = true;
    }
  }

  cerrarModalAvatar(): void {
    this.mostrarModalAvatar = false;
  }

  seleccionarAvatar(nuevoAvatar: string): void {
  // 1. Actualizamos el avatar en el objeto de edición
  this.usuarioEdit.avatar = nuevoAvatar;
  
  // 2. Cerramos el modal
  this.cerrarModalAvatar();
  
  // 3. FORZAMOS la detección de cambios para que la imagen del carnet cambie al instante
  this.cdr.detectChanges();
}

  cerrarModal() {
    this.cerrar.emit();
  }
}