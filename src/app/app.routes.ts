import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { InicioComponent } from './components/inicio/inicio';
import { SalaDetalleComponent } from './components/sala-detalle/sala-detalle'; 
import { Votacion } from './components/votacion/votacion';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'sala/:id', component: SalaDetalleComponent }, 
  { path: 'sala/:id/votacion', component: Votacion },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];