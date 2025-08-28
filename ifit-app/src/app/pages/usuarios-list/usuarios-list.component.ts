import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-list.component.html',
})
export class UsuariosListComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  usuarios: Usuario[] = [];

  ngOnInit(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Erro ao carregar usuários:', err),
    });
  }

  verDetalhes(usuarioId: number) {
    this.router.navigate(['/usuarios', usuarioId]);
  }
}
