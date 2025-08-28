import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  idade: number;
  objetivo: string;
  frequencia: number;
  nivel: string;
  lesao: string;
  local: string;
}

export interface Treino {
  id?: number;
  parte: string;
  exerciciosJson: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private baseUsuarios = 'http://localhost:8080/usuarios';
  private baseTreinos = 'http://localhost:8080/treinos';

  constructor(private http: HttpClient) {}

  // -------- Usuários --------
  criarUsuario(u: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUsuarios, u);
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUsuarios);
  }

  buscarUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUsuarios}/${id}`);
  }

  deletarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUsuarios}/${id}`);
  }

  // -------- Treinos --------
  getTreinosUsuario(usuarioId: number): Observable<Treino[]> {
    return this.http.get<Treino[]>(`${this.baseTreinos}/${usuarioId}`);
  }

  buscarTreino(treinoId: number): Observable<Treino> {
    return this.http.get<Treino>(`${this.baseTreinos}/detalhe/${treinoId}`);
  }

  criarTreino(usuarioId: number, treino: Treino): Observable<Treino> {
    return this.http.post<Treino>(`${this.baseTreinos}/${usuarioId}`, treino);
  }
  deletarTreino(treinoId: number) {
    return this.http.delete<void>(`http://localhost:8080/treinos/delete/${treinoId}`);
  }


}
