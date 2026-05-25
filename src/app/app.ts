import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Asegúrate de que las rutas de estos imports sean las correctas según tu estructura de carpetas
import { HeaderComponent } from './components/header/header'; 
import { Footer } from './components/footer/footer'; 

@Component({
  selector: 'app-root',
  standalone: true, // Asegúrate de mantener esto si lo tenías
  imports: [RouterOutlet, HeaderComponent, Footer], // Añadimos Header y Footer aquí
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('break-room');
}