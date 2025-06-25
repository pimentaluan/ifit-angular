import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-treino',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './treino.component.html',
  styleUrls: []
})
export class TreinoComponent implements OnInit {
  route = inject(ActivatedRoute);
  usuarioService = inject(UsuarioService);

  usuario = signal<Usuario | undefined>(undefined);
  treinoGerado = signal<any[]>([]);
  nome = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const usuarioId = params.get('id');
      if (usuarioId) {
        this.usuarioService.getUsuarioById(usuarioId).subscribe({
          next: (data) => {
            this.usuario.set(data);
            this.nome = data.nome;
            this.montarTreinoCompleto(data.treino || []);
          },
          error: (err) => {
            console.error('Erro ao buscar usuário:', err);
          }
        });
      }
    });
  }

  private montarTreinoCompleto(treinoBruto: any[]) {
  fetch('http://localhost:3000/exercicios') // ajuste aqui se necessário
    .then(res => res.json())
    .then((data) => {
      const treinoFinal = treinoBruto.map(dia => {
        const parte = dia.parte;
        const lista = data[parte] || [];

        const exercicios = dia.exercicios.map((id: number) => {
          return lista.find((ex: any) => ex.id === id);
        }).filter(Boolean);

        return { parte, exercicios };
      });

      this.treinoGerado.set(treinoFinal);
    })
    .catch(err => console.error('Erro ao montar treino:', err));
}

}
