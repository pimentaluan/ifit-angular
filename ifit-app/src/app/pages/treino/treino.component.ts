import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-treino',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './treino.component.html'
})
export class TreinoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  treino: any;
  blocos: any[] = [];

  ngOnInit(): void {
    const treinoId = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(treinoId)) {
      this.usuarioService.buscarTreino(treinoId).subscribe({
        next: (t: any) => {
          this.treino = t;
          try {
            this.blocos = JSON.parse(t.exerciciosJson ?? '[]');
          } catch {
            this.blocos = [];
          }
        },
        error: (err) => console.error('Erro ao carregar treino:', err),
      });
    }
  }

  removerTreino(treinoId: number) {
    if (!confirm('Tem certeza que deseja excluir este treino?')) return;

    this.usuarioService.deletarTreino(treinoId).subscribe({
      next: () => {
        alert('Treino removido com sucesso!');
        this.router.navigate(['/usuarios']); 
      },
      error: (err) => {
        console.error('Erro ao deletar treino:', err);
        alert('Erro ao deletar treino.');
      }
    });
  }
}
