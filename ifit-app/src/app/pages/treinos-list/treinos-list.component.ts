import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-treinos-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './treinos-list.component.html'
})
export class TreinosListComponent implements OnInit {
  private usuarioService = inject(UsuarioService);

  treinos = signal<Usuario[]>([]);
  busca = signal<string>('');
  carregando = signal(true);
  erro = signal<string | null>(null);

  filtrados = computed(() => {
    const q = this.busca().toLowerCase().trim();
    if (!q) return this.treinos();
    return this.treinos().filter(t =>
      (t.nome ?? '').toLowerCase().includes(q) ||
      (t.email ?? '').toLowerCase().includes(q) ||
      (t.objetivo ?? '').toLowerCase().includes(q) ||
      (t.local ?? '').toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.usuarioService.listar().subscribe({
      next: (list) => { this.treinos.set(list); this.carregando.set(false); },
      error: () => { this.erro.set('Não foi possível carregar os treinos.'); this.carregando.set(false); }
    });
  }
}
