import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
export enum Cinsiyet { Erkek = 1, Kadin = 2 }
export enum MedeniDurum { Bekar = 1, Evli = 2 }
export enum BorcluTipi {
  AsilKrediBorclusu = 1,
  Kefil = 2,
  Mirasci = 3,
  Ciranta = 4,
  Kesideci = 5
}
export enum MusteriTuru { Bireysel = 1, Kurumsal = 2 }

export interface MusteriListDto {
  id: string; 
  musteriNo: string;
  adiUnvani: string | null;
  borcluTipi: BorcluTipi;
}

export interface Musteri {
  id?: string; 
  musteriNo: string;
  adiUnvani: string | null;
  borcluTipi: BorcluTipi;
  borcluSoyadi: string | null;
  tckn: string | null;
  dogumTarihi: string | null; // "YYYY-MM-DD"
  dogumYeri: string | null;
  cinsiyet: Cinsiyet | null;
  medeniDurum: MedeniDurum | null;
  babaAdi: string | null;
  anneAdi: string | null;
  pasaportNumarasi: string | null;
  kimlikVerilisTarihi: string | null; // "YYYY-MM-DD"
  nufusaKayitliOlduguIl: string | null;
  ciltNo: string | null;
  aileSiraNo: string | null;
  kutukSiraNo: string | null;
  surucuBelgesiNumarasi: string | null;
  sehirId: number | null;
  ilceId: number | null;
  semt: string | null;
  vergiDairesi: string | null;
  vergiNo: string | null;
  sskNo: string | null;
  sskIsyeriNumarasi: string | null;
  ticaretSicilNo: string | null;
  borcuTipi: string | null;
  musteriMusteriTipi: MusteriTuru;
  hayattaMi: boolean;
}

export interface SayfaSonucu<T> {
  totalCount: number;
  items: T[];
}

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

  // ---------- YENİ EKLENEN METOT ----------
  /** İhtarı olan tüm müşterileri getirir */
  ihtarliMusterileriListele(): Observable<MusteriListDto[]> {
    return this.http.get<MusteriListDto[]>(`${this.baseUrl}/ihtarli-musteriler`);
  }
  // ---------- BİTTİ ----------

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
