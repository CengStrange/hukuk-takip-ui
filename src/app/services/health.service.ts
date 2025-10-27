import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ÖNEMLİ: Sadece relative path kullanıyoruz. Proxy.conf.json /api'yi 7188'e yönlendiriyor.
// Interceptor da sadece HttpClient çağrılarına Authorization ekler.
@Injectable({ providedIn: 'root' })
export class HealthService {
  private base = '/api/health';

  constructor(private http: HttpClient) {}

  ping(): Observable<any> {
    return this.http.get(`${this.base}/ping`);
  }

  db(): Observable<any> {
    return this.http.get(`${this.base}/db`);
  }

  secure(): Observable<any> {
    return this.http.get(`${this.base}/secure`);
  }

  adminOnly(): Observable<any> {
    return this.http.get(`${this.base}/admin-only`);
  }

  // Tanı için: token ve claim'ler doğru mu?
  me(): Observable<any> {
    return this.http.get('/api/auth/me');
  }
}
