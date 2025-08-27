// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormularioComponent } from './pages/formulario/formulario.component';
import { TreinoComponent } from './pages/treino/treino.component';
import { TreinosListComponent } from './pages/treinos-list/treinos-list.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'formulario', component: FormularioComponent, canActivate: [authGuard] },
  { path: 'treino/:id', component: TreinoComponent, canActivate: [authGuard] },
  { path: 'treinos', component: TreinosListComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
