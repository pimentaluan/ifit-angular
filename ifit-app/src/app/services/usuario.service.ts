import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DiaTreino { parte: string; exercicios: number[]; }

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  objetivo: string;
  idade?: number;
  frequencia?: number;
  nivel?: string;
  lesao?: string;
  local?: string;
  treino?: DiaTreino[];
  genero?: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private base = environment.api;

  /** ADMIN: lista todos os usuários */
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.base}/usuarios`);
  }

  /** ADMIN: busca qualquer usuário por id */
  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.base}/usuarios/${id}`);
  }

  /** ADMIN: cria usuário (não use no formulário; formulário só atualiza treino do logado) */
  criarUsuario(u: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.base}/usuarios`, u);
  }

  /** Logado: dados do próprio usuário */
  me(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.base}/me`);
  }

  /** Logado: atualiza SOMENTE o treino do usuário logado */
  atualizarMeuTreino(treino: DiaTreino[]): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.base}/me/treino`, treino);
  }
}
