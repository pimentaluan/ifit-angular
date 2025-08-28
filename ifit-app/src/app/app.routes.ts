import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormularioComponent } from './pages/formulario/formulario.component';
import { TreinoComponent } from './pages/treino/treino.component';
import { UsuariosListComponent } from './pages/usuarios-list/usuarios-list.component';
import { UsuarioDetalheComponent } from './pages/usuario-detalhe/usuario-detalhe.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'formulario', component: FormularioComponent },
  { path: 'treino/:id', component: TreinoComponent },
  { path: 'usuarios', component: UsuariosListComponent },
  { path: 'usuarios/:id', component: UsuarioDetalheComponent },
];