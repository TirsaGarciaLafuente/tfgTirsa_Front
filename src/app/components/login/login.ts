import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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

  tieneLetra = false;
  tieneNumero = false;
  tieneEspecial = false;
  tieneLongitud = false;

  isAnimating = false;
  showIntro = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService, 
    private router: Router, 
    private cdr: ChangeDetectorRef, 
    private alertService: AlertService
  ) { }

  openModal() { this.modalAbierto = true; }
  closeModal() { this.modalAbierto = false; }
  handleOverlayClick(e: Event) { this.closeModal(); }
  openModalPassword() { this.modalPasswordAbierto = true; }
  closeModalPassword() { this.modalPasswordAbierto = false; this.recuperarError = ''; }
  handleOverlayClickPassword(e: Event) { this.closeModalPassword(); }

  openModalNuevaPassword() {
    this.modalNuevaPasswordAbierto = true;
  }

  closeModalNuevaPassword() {
    this.modalNuevaPasswordAbierto = false;
    this.nuevaPasswordError = '';
    this.nuevaPasswordOk = '';
  }

  handleOverlayClickNuevaPassword(e: Event) { this.closeModalNuevaPassword(); }

  validarContrasena() {
    const pass = this.registerData.password;
    this.tieneLongitud = pass.length >= 5;
    this.tieneLetra = /[a-zA-Z]/.test(pass);
    this.tieneNumero = /[0-9]/.test(pass);
    this.tieneEspecial = /[^a-zA-Z0-9]/.test(pass);
  }

  get contrasenaValida(): boolean {
    return this.tieneLetra && this.tieneNumero && this.tieneEspecial && this.registerData.password.length >= 6;
  }

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (response: any) => {
        if (response && response.jwt) {
            localStorage.setItem('token', response.jwt);
            localStorage.setItem('usuario', 'True');
            this.authService.loginSuccess$.next(); 
        }
        if (isPlatformBrowser(this.platformId)) {
          this.showIntro = true;
            this.isAnimating = true;
            this.cdr.detectChanges(); 

            setTimeout(() => {
              this.showIntro = false;
              this.cdr.detectChanges();
              this.router.navigate(['/inicio']);
            }, 1000);
        }
      },
      error: (err: any) => {
        this.alertService.error('Usuario o contraseña incorrectos');
      }
    });
  }
  
  onRegister() {
    if (!this.contrasenaValida) {
      return; 
    }

    this.authService.registro(this.registerData).subscribe({
      next: (response: any) => {
        this.alertService.success('Registro correcto');
        this.router.navigate(['/inicio']);
      },
      error: (err: any) => {
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