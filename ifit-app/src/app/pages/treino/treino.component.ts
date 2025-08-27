import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { environment } from '../../../environments/environment';

type DiaTreino = { parte: string; exercicios: any[] };

@Component({
  selector: 'app-treino',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './treino.component.html',
  styleUrls: ['./treino.component.css'],
})
export class TreinoComponent implements OnInit {
  route = inject(ActivatedRoute);
  usuarioService = inject(UsuarioService);
  http = inject(HttpClient);

  usuario = signal<Usuario | null>(null);
  treinoGerado = signal<DiaTreino[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  nome = '';
  private exMap = new Map<number, any>();

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<any>(`${environment.api}/exercicios`).subscribe({
      next: (data) => {
        for (const grupo of Object.keys(data || {})) {
          for (const ex of data[grupo] || []) this.exMap.set(ex.id, ex);
        }
        this.loadUsuario(id);
      },
      error: () => { this.erro.set('Erro ao carregar exercícios.'); this.carregando.set(false); }
    });
  }

  private loadUsuario(id: number) {
    this.usuarioService.buscarPorId(id).subscribe({
      next: (u) => {
        this.usuario.set(u);
        this.nome = u?.nome ?? '';
        const resolved: DiaTreino[] = (u?.treino || []).map((dia: any) => ({
          parte: dia.parte,
          exercicios: (dia.exercicios || [])
            .map((item: any) => (typeof item === 'number' ? this.exMap.get(item) : item))
            .filter(Boolean),
        }));
        this.treinoGerado.set(resolved);
        this.carregando.set(false);
      },
      error: () => { this.erro.set('Erro ao carregar usuário.'); this.carregando.set(false); }
    });
  }
}
