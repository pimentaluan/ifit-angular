import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-detalhe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-detalhe.component.html',
})
export class UsuarioDetalheComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  usuario?: Usuario;
  treinos: any[] = [];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.usuarioService.buscarUsuario(id).subscribe({
        next: (data: Usuario) => this.usuario = data,
        error: (err) => console.error('Erro ao carregar usuário:', err),
      });

      this.usuarioService.getTreinosUsuario(id).subscribe({
        next: (data: any[]) => this.treinos = data,
        error: (err) => console.error('Erro ao carregar treinos:', err),
      });
    }
  }

  verTreino(treinoId: number) {
    this.router.navigate(['/treino', treinoId]);
  }
}
