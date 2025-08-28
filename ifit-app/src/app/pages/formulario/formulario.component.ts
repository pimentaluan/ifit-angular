import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private http = inject(HttpClient);

  todosExercicios: any = {};
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  form = {
    nome: '',
    email: '',
    idade: 0,
    objetivo: '',
    frequencia: 3,
    nivel: '',
    lesao: 'nenhuma',
    local: ''
  };

  get idadeNum(): number { return Number(this.form.idade ?? 0); }
  get freqNum(): number { return Number(this.form.frequencia ?? 0); }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8080/exercicios').subscribe({
      next: (data) => {
        this.todosExercicios = data.reduce((acc, ex) => {
          const parte = ex.parte || 'Outros';
          if (!acc[parte]) acc[parte] = [];
          acc[parte].push(ex);
          return acc;
        }, {} as any);
      },
      error: () => (this.mensagemErro = 'Erro ao carregar exercícios.')
    });
  }

  gerarTreino(formRef: NgForm) {
    this.mensagemSucesso = null;
    this.mensagemErro = null;

    if (formRef.invalid || isNaN(this.idadeNum) || this.idadeNum < 16 || this.idadeNum > 120) {
      this.mensagemErro = 'Verifique os dados preenchidos.';
      return;
    }

    const treinoGerado = this.montarTreino();

    const usuarioPayload: Usuario = {
      nome: this.form.nome.trim(),
      email: this.form.email.trim(),
      idade: this.idadeNum
    } as Usuario;

    this.usuarioService.criarUsuario(usuarioPayload).subscribe({
      next: (usuario) => {
        const usuarioId = usuario.id!;
        const treinoPayload = {
          parte: 'Treino personalizado',
          objetivo: this.form.objetivo,
          local: this.form.local,
          nivel: this.form.nivel,
          frequencia: this.freqNum,
          lesao: this.form.lesao,
          exerciciosJson: JSON.stringify(treinoGerado)
        };

        this.usuarioService.criarTreino(usuarioId, treinoPayload).subscribe({
          next: () => {
            this.mensagemSucesso = 'Usuário e treino cadastrados! Redirecionando...';
            this.router.navigate(['/usuarios', usuarioId]);
          },
          error: () => this.mensagemErro = 'Erro ao salvar treino.'
        });
      },
      error: () => this.mensagemErro = 'Erro ao salvar usuário.'
    });
  }

  private montarTreino() {
    const dias = this.freqNum;
    const partes = ['Tórax', 'Costas', 'Pernas'];
    const partesSelecionadas: string[] = [];

    const lesao = (this.form.lesao || 'nenhuma').toLowerCase();
    let i = 0;
    while (partesSelecionadas.length < dias) {
      const parte = partes[i % partes.length];
      if (lesao !== 'nenhuma' && lesao === parte.toLowerCase()) { i++; continue; }
      partesSelecionadas.push(parte);
      i++;
    }

    const objetivoDb = this.mapObjetivoParaBanco((this.form.objetivo || '').toLowerCase());
    const localFront = (this.form.local || '').toLowerCase();

    return partesSelecionadas.map((parte) => {
      const lista = (this.todosExercicios[parte] || []).filter((ex: any) => {
        const objEx = (ex.objetivo || '').toLowerCase();
        const locEx = (ex.local || '').toLowerCase();
        const objetivoOk = objEx === objetivoDb;
        const localOk = localFront === '' ? true : locEx === localFront;
        return objetivoOk && localOk;
      });

      const selecionados = this.sortearExercicios(lista, 5);
      return {
        parte,
        exercicios: selecionados.map((ex: any) => ({
          id: ex.id,
          nome: ex.nome,
          series: ex.series,
          reps: ex.reps,
          instrucoes: ex.instrucoes
        }))
      };
    });
  }

  private mapObjetivoParaBanco(obj: string): string {
    if (obj.includes('massa') || obj.includes('hipertrof')) return 'criar massa muscular';
    if (obj.includes('emag')) return 'emagrecer';
    if (obj.includes('saúde') || obj.includes('saude')) return 'melhorar a saúde';
    return obj;
  }

  private sortearExercicios(lista: any[], qtd: number) {
    const copia = [...lista];
    const resultado: any[] = [];
    while (resultado.length < qtd && copia.length > 0) {
      const idx = Math.floor(Math.random() * copia.length);
      resultado.push(copia[idx]);
      copia.splice(idx, 1);
    }
    return resultado;
  }
}
