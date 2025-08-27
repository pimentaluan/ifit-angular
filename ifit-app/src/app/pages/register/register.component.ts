import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  carregando = false;
  erro: string | null = null;
  ok: string | null = null;
  redirectTo = '/';

  form = {
    nome: '',
    email: '',
    senha: '',
    confirmar: ''
  };

  ngOnInit(): void {
    this.redirectTo = this.route.snapshot.queryParamMap.get('redirect') || '/';
  }

  registrar(f: NgForm) {
    this.erro = null;
    this.ok = null;

    if (f.invalid) {
      this.erro = 'Preencha todos os campos obrigatórios.';
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(this.form.email)) {
      this.erro = 'E-mail inválido.';
      return;
    }
    if ((this.form.senha || '').length < 6) {
      this.erro = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }
    if (this.form.senha !== this.form.confirmar) {
      this.erro = 'As senhas não conferem.';
      return;
    }

    this.carregando = true;
    this.auth.register({
      nome: this.form.nome,
      email: this.form.email,
      senha: this.form.senha
    }).subscribe({
      next: () => {
        this.ok = 'Conta criada com sucesso! Redirecionando...';
        this.router.navigateByUrl(this.redirectTo);
      },
      error: (e) => {
        this.erro = e?.error?.message || 'Não foi possível criar a conta.';
      }
    }).add(() => this.carregando = false);
  }
}
