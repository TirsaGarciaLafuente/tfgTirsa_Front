import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { HeaderComponent } from './components/header/header'; 
import { Footer } from './components/footer/footer'; 
import { PerfilComponent } from './components/perfil/perfil'; // Importa el perfil
import { ModalService } from './services/modal.service'; // Importa tu servicio

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer, PerfilComponent, CommonModule], // Añade los nuevos
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('break-room');

  // Inyectamos el servicio como public para usarlo en el HTML
  constructor(public modalService: ModalService) {}
}