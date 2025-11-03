import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Musteri, MusteriListDto } from '../core/models/musteri.model';
import { SayfaSonucu } from '../core/models/musteri.model';

@Injectable({ providedIn: 'root' })
export class MusterilerService {
  private http = inject(HttpClient);
  private baseUrl = '/api/musteriler';

  getir(id: string): Observable<Musteri> {
    return this.http.get<Musteri>(`${this.baseUrl}/${id}`);
  }

  listele(q: string | null, page = 1, pageSize = 10): Observable<SayfaSonucu<MusteriListDto>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (q && q.trim().length > 0) params = params.set('q', q.trim());
    
    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map(res => ({
        totalCount: res.total,
        items: res.items
      }))
    );
  }


  ihtarliMusterileriListele(): Observable<MusteriListDto[]> {
    return this.http.get<MusteriListDto[]>(`${this.baseUrl}/ihtarli-musteriler`);
  }

  create(dto: Partial<Musteri>): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.baseUrl, dto);
  }

  update(id: string, dto: Partial<Musteri>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  check(musteriNo?: string | null, tckn?: string | null, vergiNo?: string | null): Observable<{ musteriNoTaken: boolean; tcknTaken: boolean; vergiNoTaken: boolean; }> {
    let params = new HttpParams();
    if (musteriNo) params = params.set('musteriNo', musteriNo);
    if (tckn) params = params.set('tckn', tckn);
    if (vergiNo) params = params.set('vergiNo', vergiNo);
    return this.http.get<{ musteriNoTaken: boolean; tcknTaken: boolean; vergiNoTaken: boolean; }>(`${this.baseUrl}/check`, { params });
  }
}


