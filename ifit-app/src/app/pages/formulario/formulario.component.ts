import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Usuario, DiaTreino } from '../../services/usuario.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  todosExercicios: any = {};
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  form: Partial<Usuario> = {
    nome: '',          // mantive caso você queira exibir/usar, mas não é obrigatório para atualizar treino
    email: '',         // idem
    objetivo: '',
    idade: 0,
    frequencia: 3,
    nivel: '',
    lesao: '',
    local: '',
    treino: []
  };

  async ngOnInit(): Promise<void> {
    // se não estiver no browser (SSR), não tentar redirecionar ou tocar em localStorage
    if (isPlatformBrowser(this.platformId)) {
      // checa se está logado: como o backend exige JWT, basta verificar se há token salvo (pelo seu AuthService/interceptor)
      const token = localStorage.getItem('ifit.token');
      if (!token) {
        // manda para login e volta para o formulário após autenticar
        this.router.navigate(['/login'], { queryParams: { redirect: '/formulario' } });
        return;
      }
    }

    this.http.get(`${environment.api}/exercicios`).subscribe({
      next: (data) => (this.todosExercicios = data),
      error: () => (this.mensagemErro = 'Erro ao carregar exercícios.')
    });
  }

  gerarTreino(formRef: NgForm) {
    this.mensagemSucesso = null;
    this.mensagemErro = null;

    const idade = this.form.idade ?? 0;
    if (formRef.invalid || idade < 16 || idade > 120) {
      this.mensagemErro = 'Verifique os dados preenchidos.';
      return;
    }

    const treino = this.montarTreino();
    // **NOVO FLUXO**: atualiza treino do usuário logado
    this.usuarioService.atualizarMeuTreino(treino).subscribe({
      next: () => {
        // depois busca /me pra pegar o id e navegar para /treino/:id
        this.usuarioService.me().subscribe({
          next: (me) => {
            this.mensagemSucesso = 'Treino gerado!';
            this.router.navigate(['/treino', me.id]);
          },
          error: () => {
            // fallback: apenas manda pra home se por algum motivo /me falhar
            this.router.navigate(['/']);
          }
        });
      },
      error: (err) => {
        console.error('PUT /me/treino falhou:', err);
        this.mensagemErro = `Erro ao salvar treino (status ${err?.status ?? '??'})`;
      }
    });
  }

  montarTreino(): DiaTreino[] {
    const dias = Number(this.form.frequencia ?? 0);
    const partes = ['Tórax', 'Costas', 'Pernas'];
    const partesSelecionadas: string[] = [];

    let i = 0;
    while (partesSelecionadas.length < dias) {
      const parte = partes[i % partes.length];

      // se "lesao" for exatamente o nome da parte, pula; se for "nenhuma", não bloqueia nada
      const lesao = (this.form.lesao ?? '').trim().toLowerCase();
      if (lesao && lesao !== 'nenhuma' && parte.toLowerCase() === lesao) {
        i++; continue;
      }

      partesSelecionadas.push(parte);
      i++;
    }

    const objetivo = (this.form.objetivo ?? '').toLowerCase();
    const local = (this.form.local ?? '').toLowerCase();

    return partesSelecionadas.map((parte) => {
      const lista = this.todosExercicios[parte]?.filter((ex: any) =>
        ex.objetivo?.toLowerCase() === objetivo &&
        (local === 'academia' || ex.local?.toLowerCase() === local)
      ) || [];

      const selecionados = this.sortearExercicios(lista, 5 + Math.floor(Math.random() * 3));
      return { parte, exercicios: selecionados.map((ex: any) => ex.id) };
    });
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
