import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  me(): Observable<any> {
    return this.http.get('/api/auth/me');
  }
}
