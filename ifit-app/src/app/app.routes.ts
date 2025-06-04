import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormularioComponent } from './pages/formulario/formulario.component';
import { TreinoComponent } from './pages/treino/treino.component'; // IMPORTAR o componente

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'formulario', component: FormularioComponent },
  { path: 'treino', component: TreinoComponent }
];
