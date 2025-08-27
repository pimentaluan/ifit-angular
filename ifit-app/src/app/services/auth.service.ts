import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
  id: number;
  nome: string;
  email: string;
  role: string; // "ROLE_USER" | "ROLE_ADMIN"
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private _token: string | null = null;
  private _role: string | null = null;
  private _userId: number | null = null;

  constructor() {
    this.loadUser();
  }

  private isBrowser() { return isPlatformBrowser(this.platformId); }

  private loadUser() {
    if (!this.isBrowser()) return;
    const raw = localStorage.getItem('ifit_auth');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      this._token = parsed.token ?? null;
      this._role  = parsed.role  ?? null;
      this._userId = parsed.id   ?? null;
    } catch {}
  }

  private persist(auth: AuthResponse) {
    if (!this.isBrowser()) return;
    localStorage.setItem('ifit_auth', JSON.stringify(auth));
  }

  token() { return this._token; }
  userId() { return this._userId; }
  role() { return this._role; }

  isLoggedIn() { return !!this._token; }
  isAdmin() { return this._role === 'ROLE_ADMIN'; }

  login(email: string, senha: string) {
    return this.http.post<AuthResponse>(`${environment.api}/auth/login`, { email, senha });
  }

  register(body: any) {
    return this.http.post<AuthResponse>(`${environment.api}/auth/register`, body);
  }

  applySession(resp: AuthResponse, returnUrl?: string) {
    this._token = resp.token;
    this._role  = resp.role;
    this._userId = resp.id;
    this.persist(resp);
    if (returnUrl) this.router.navigateByUrl(returnUrl);
    else this.router.navigateByUrl('/');
  }

  logout() {
    this._token = this._role = null;
    this._userId = null;
    if (this.isBrowser()) localStorage.removeItem('ifit_auth');
    this.router.navigate(['/login']);
  }
}
