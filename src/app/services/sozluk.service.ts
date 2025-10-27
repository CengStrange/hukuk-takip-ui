import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

// DÜZELTME: Projenin ihtiyaç duyduğu tüm sözlük modelleri,
// dosya yolu hatalarını önlemek için doğrudan bu serviste tanımlandı.

export interface Sehir {
    id: number;
    ad: string;
}

export interface Sube {
    brmKod: number;
    brmAd: string;
}


export interface Ilce {
    id: number;
    ad: string;
}

export interface DavaTuru {
    id: number;
    ad: string;
}

export interface IcraDairesi {
    id: number;
    ad: string;
    sehirId: number;
    sehirAd: string;
}

type CacheEntry<T> = { ts: number; obs: Observable<T> };

@Injectable({ providedIn: 'root' })
export class SozlukService {
    private http = inject(HttpClient);
    private base = `/api/sozluk`;
    private ttlMs = 15 * 60 * 1000; // 15 dk
    private cache = new Map<string, CacheEntry<any>>();

    private getCached<T>(key: string, producer: () => Observable<T>): Observable<T> {
        const now = Date.now();
        const hit = this.cache.get(key);
        if (hit && now - hit.ts < this.ttlMs) return hit.obs as Observable<T>;
        const obs = producer().pipe(shareReplay(1));
        this.cache.set(key, { ts: now, obs });
        return obs;
    }
    
    subeler(): Observable<Sube[]> {
        const key = `subeler`;
        return this.getCached(key, () => this.http.get<Sube[]>('/api/subeler'));
    }

    sehirler(q?: string, take = 81): Observable<Sehir[]> {
        let params = new HttpParams().set('take', String(take));
        if (q) params = params.set('q', q);
        const key = `sehirler:${q ?? ''}:${take}`;
        return this.getCached(key, () =>
            this.http.get<Sehir[]>(`${this.base}/sehirler`, { params })
        );
    }

    // GÜNCELLEME: Metot artık arama parametresi (q) alabiliyor.
    ilceler(sehirId: number, q?: string): Observable<Ilce[]> {
        let params = new HttpParams().set('sehirId', String(sehirId));
        if (q && q.trim()) {
            params = params.set('q', q.trim());
        }
        return this.http.get<Ilce[]>(`${this.base}/ilceler`, { params });
    }

    davaTurleri(q?: string, take = 100): Observable<DavaTuru[]> {
        let params = new HttpParams().set('take', String(take));
        if (q) params = params.set('q', q);
        const key = `davaTurleri:${q ?? ''}:${take}`;
        return this.getCached(key, () =>
            this.http.get<DavaTuru[]>(`${this.base}/dava-turleri`, { params })
        );
    }

    icraDaireleri(opts: { sehirId?: number; q?: string; onlyIcra?: boolean; take?: number } = {}): Observable<IcraDairesi[]> {
        let params = new HttpParams().set('take', String(opts.take ?? 200));
        if (opts.sehirId != null) params = params.set('sehirId', String(opts.sehirId));
        if (opts.q) params = params.set('q', opts.q);
        if (opts.onlyIcra) params = params.set('onlyIcra', 'true');
        const key = `icraDaireleri:${opts.sehirId ?? ''}:${opts.q ?? ''}:${opts.onlyIcra ? 1 : 0}:${opts.take ?? 200}`;
        return this.getCached(key, () =>
            this.http.get<IcraDairesi[]>(`${this.base}/icra-daireleri`, { params })
        );
    }

    clearCache(prefix?: string) {
        if (!prefix) { this.cache.clear(); return; }
        for (const k of Array.from(this.cache.keys())) if (k.startsWith(prefix)) this.cache.delete(k);
    }
}

