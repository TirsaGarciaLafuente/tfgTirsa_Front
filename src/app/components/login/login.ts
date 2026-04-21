import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {

  modalAbierto = false;
  loginError = '';
  registerMensaje = '';
  modalPasswordAbierto = false;
  recuperarError = '';
  modalNuevaPasswordAbierto = false;
  nuevaPasswordError = '';
  nuevaPasswordOk = '';
  nuevaPasswordData = { password: '', confirmar: '' };
  recuperarData = { email: '', username: '' };
  loginData = { username: '', password: '' };
  registerData = { nombre: '', email: '', username: '', password: '' };

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef, private alertService:AlertService) { }

  openModal() { this.modalAbierto = true; }
  closeModal() { this.modalAbierto = false; }
  handleOverlayClick(e: Event) { this.closeModal(); }
  openModalPassword() { this.modalPasswordAbierto = true; }
  closeModalPassword() { this.modalPasswordAbierto = false; this.recuperarError = ''; }
  handleOverlayClickPassword(e: Event) { this.closeModalPassword(); }

  openModalNuevaPassword() {
    console.log('abriendo nueva password');
    this.modalNuevaPasswordAbierto = true;
    console.log('estado:', this.modalNuevaPasswordAbierto);
  }

  closeModalNuevaPassword() {
    this.modalNuevaPasswordAbierto = false;
    this.nuevaPasswordError = '';
    this.nuevaPasswordOk = '';
  }

  handleOverlayClickNuevaPassword(e: Event) { this.closeModalNuevaPassword(); }

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (response: any) => {
        console.log('¡Bienvenido!', response);
        this.alertService.success('Login correcto');
        this.router.navigate(['/inicio']);
      },
      error: (err: any) => {
        console.error('Error en el login', err);
        this.alertService.error('Usuario o contraseña incorrectos');
      }
    });
  }
  onRegister() {
    this.authService.registro(this.registerData).subscribe({
      next: (response: any) => {
        console.log('¡Bienvenido!', response);
        this.alertService.success('Registro correcto');
        this.router.navigate(['/inicio']);
      },
      error: (err: any) => {
        console.error('Error en el login', err);
        this.alertService.error('Email o nombre de usuario ya existente');
      }
    });
  }

  onVerificarUsuario() {
    this.authService.verificarUsuario(this.recuperarData).subscribe({
      next: () => {
        this.closeModalPassword();
        this.openModalNuevaPassword();
        this.cdr.detectChanges();
      },
      error: () => {
        this.recuperarError = 'No existe ningún usuario con esos datos.';
        this.cdr.detectChanges();
      }
    });
  }

  onCambiarPassword() {
    if (this.nuevaPasswordData.password !== this.nuevaPasswordData.confirmar) {
      this.nuevaPasswordError = 'Las contraseñas no coinciden.';
      return;
    }
    this.authService.cambiarPassword({
      email: this.recuperarData.email,
      username: this.recuperarData.username,
      password: this.nuevaPasswordData.password
    }).subscribe({
      next: () => {
        this.nuevaPasswordOk = '¡Contraseña actualizada correctamente!';
        this.nuevaPasswordError = '';
        setTimeout(() => this.closeModalNuevaPassword(), 2000);
      },
      error: () => {
        this.nuevaPasswordError = 'Error al actualizar la contraseña.';
      }
    });
  }

}