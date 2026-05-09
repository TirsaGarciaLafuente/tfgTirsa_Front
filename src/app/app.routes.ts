import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { InicioComponent } from './components/inicio/inicio';
import { SalaDetalleComponent } from './components/sala-detalle/sala-detalle'; // Asegúrate de que esté importado

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'sala/:id', component: SalaDetalleComponent }, // Esta es la clave
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];