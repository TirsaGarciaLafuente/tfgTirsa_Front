import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  imports: [CommonModule, FormsModule]
})
export class InicioComponent {

  codigoSala = '';

  constructor(private router: Router) {}

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  crearSala() {
    // TODO: implementar
  }

  unirseASala() {
    // TODO: implementar con this.codigoSala
  }

  entrarSala(salaId: number) {
    // TODO: implementar
  }
}
