import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { InicioComponent } from './components/inicio/inicio';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];