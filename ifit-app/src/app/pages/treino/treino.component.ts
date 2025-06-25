import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service'; // Importe Usuario

@Component({
  selector: 'app-treino',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './treino.component.html',
  styleUrls: []
})
export class TreinoComponent implements OnInit {
  route = inject(ActivatedRoute);
  usuarioService = inject(UsuarioService);

  usuario = signal<Usuario | undefined>(undefined);
  treinoGerado = signal<any[]>([]);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // Obtenha o ID como string diretamente
      const usuarioId = params.get('id'); // <-- Remova o Number() aqui
      if (usuarioId) { // Verifique se o ID existe (agora como string)
        this.buscarUsuario(usuarioId); // <-- Passe o ID como string
        this.gerarTreinoComBaseNoUsuario(usuarioId); // <-- Passe o ID como string
      } else {
        console.warn('ID de usuário inválido na rota.');
      }
    });
  }

  // Altere o tipo do parâmetro 'id' para 'string'
  private buscarUsuario(id: string) {
    this.usuarioService.getUsuarioById(id).subscribe({
      next: (data) => {
        this.usuario.set(data);
        console.log('Usuário carregado:', this.usuario());
      },
      error: (error) => {
        console.error('Erro ao carregar usuário:', error);
      }
    });
  }

  // Se 'gerarTreinoComBaseNoUsuario' usa o ID, ele também deve ser string
  private gerarTreinoComBaseNoUsuario(usuarioId: string) { // <-- Altere o tipo para string
    fetch('/assets/data/exercicios.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const exerciciosDisponiveis = data.exercicios;

        const objetivoUsuario = this.usuario()?.objetivo?.toLowerCase();
        let treinoFiltrado: any[] = [];

        if (objetivoUsuario === 'ganho de massa') {
          treinoFiltrado = exerciciosDisponiveis.filter((e: any) => e.foco === 'força' || e.foco === 'hipertrofia');
        } else if (objetivoUsuario === 'perda de peso') {
          treinoFiltrado = exerciciosDisponiveis.filter((e: any) => e.foco === 'cardio' || e.foco === 'emagrecimento');
        } else {
          treinoFiltrado = exerciciosDisponiveis.filter((e: any) => e.nivel === 'iniciante' || e.nivel === 'intermediario');
        }

        this.treinoGerado.set(treinoFiltrado.slice(0, 5));
        console.log('Treino gerado:', this.treinoGerado());
      })
      .catch(error => console.error('Erro ao carregar ou gerar treino:', error));
  }
}