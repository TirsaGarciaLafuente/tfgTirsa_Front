import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header'; 
import { Footer } from './components/footer/footer'; 
import { PerfilComponent } from './components/perfil/perfil';
import { ModalService } from './services/modal.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer, PerfilComponent, CommonModule], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('break-room');


  constructor(public modalService: ModalService) {}
}