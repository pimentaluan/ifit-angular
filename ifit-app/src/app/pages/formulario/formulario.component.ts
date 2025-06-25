import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: []
})
export class FormularioComponent {
  router = inject(Router);
  usuarioService = inject(UsuarioService);

  novoUsuario: Usuario = {
    nome: '',
    email: '',
    peso: undefined,
    altura: undefined,
    objetivo: ''
  };

  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  onSubmit() {
    this.mensagemSucesso = null;
    this.mensagemErro = null;

    if (!this.novoUsuario.nome || !this.novoUsuario.email) {
      this.mensagemErro = 'Nome e email são obrigatórios.';
      return;
    }

    this.usuarioService.criarUsuario(this.novoUsuario).subscribe({
      next: (response) => {
        console.log('Usuário criado com sucesso:', response);
        // --- ADICIONE ESTA LINHA PARA DEPURAR O ID ---
        console.log('ID do usuário retornado pelo servidor:', response.id);
        // --- FIM DA LINHA DE DEPURACAO ---
        this.mensagemSucesso = 'Usuário cadastrado com sucesso! Gerando seu treino...';
        this.router.navigate(['/treino', response.id]);
      },
      error: (error) => {
        console.error('Erro ao criar usuário:', error);
        this.mensagemErro = 'Erro ao cadastrar usuário. Tente novamente.';
      }
    });
  }
}