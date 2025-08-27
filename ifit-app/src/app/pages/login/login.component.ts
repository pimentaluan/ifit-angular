import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  senha = '';       // <-- usa "senha"
  erro: string | null = null;
  carregando = false;

  submit() {
    this.erro = null;
    this.carregando = true;
    const email = this.email.trim(); 
    const senha = this.senha;

    this.auth.login(email, senha).subscribe({
      next: (resp) => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
        this.auth.applySession(resp, returnUrl);
      },
      error: () => {
        this.erro = 'Falha no login';
        this.carregando = false;
      }
    });
  }

}
