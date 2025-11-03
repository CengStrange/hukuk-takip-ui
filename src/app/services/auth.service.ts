import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { clearToken, setToken } from '../core/token.util';

export type LoginRequest = { email: string; sifre: string };

export type LoginResponse = {
  token: string;
  expiresAt: string;
  rol: string;
  kullaniciAdi: string;
  email: string;
};

export type AuthUser = LoginResponse;

const LS_KEY = 'auth_user';
const API_URL = '/api'; // proxy.conf.json sayesinde backend'e gider

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  /** Backend'e login isteği atar ve kullanıcıyı localStorage + token.util içine kaydeder */
  login(dto: LoginRequest) {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, dto).pipe(
      map(res => res as AuthUser),
      tap(u => {
        localStorage.setItem(LS_KEY, JSON.stringify(u));
        setToken(u.token);
      })
    );
  }

  /** Çıkış yapar */
  logout() {
    localStorage.removeItem(LS_KEY);
    clearToken();
  }

  /** LocalStorage'dan mevcut kullanıcı */
  get currentUser(): AuthUser | null {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
  get isLoggedIn(): boolean {
    const u = this.currentUser;
    if (!u) return false;
    return new Date(u.expiresAt).getTime() > Date.now();
  }
}
