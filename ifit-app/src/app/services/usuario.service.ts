import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Defina uma interface para o tipo de dado que você espera
export interface Usuario {
  id?: string; // <-- Mude de 'number' para 'string'
  nome: string;
  email: string;
  peso?: number;
  altura?: number;
  objetivo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // Se você tiver um método para buscar por ID, ele deve continuar funcionando
  // pois o ID será uma string na URL
  getUsuarioById(id: string): Observable<Usuario> { // <-- Altere o tipo do parâmetro para string
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Usuario>(url);
  }

  criarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }
}