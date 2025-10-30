import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';


export enum AvukatTipi {
    Sozlesmeli = 'Sözleşmeli',
    Kadrolu = 'Kadrolu',
    DisKaynak = 'DışKaynak'
}

export const AvukatTipiText: { [key in AvukatTipi]: string } = {
    [AvukatTipi.Sozlesmeli]: 'Sözleşmeli',
    [AvukatTipi.Kadrolu]: 'Kadrolu',
    [AvukatTipi.DisKaynak]: 'Dış Kaynak'
};

export interface AvukatListDto {
    id: string;
    adi: string;
    soyadi: string;
}

export interface Avukat {
    id: string;
    adi: string;
    soyadi: string;
    tckn?: string | null;
    vergiDairesi?: string | null;
    vergiNo?: string | null;
    email?: string | null;
    dogumTarihi?: string | null; 
    cepTelefonu?: string | null;
    isTelefonu?: string | null;
    isFaxNo?: string | null;
    sehirId?: number | null;
    ilceId?: number | null;
    tamAdres?: string | null;
    avansHesapSubeId?: number | null;
    avansHesapNo?: string | null;
    vadesizHesapSubeId?: number | null;
    vadesizHesapNo?: string | null;
    halkbankVadesizIbanNo?: string | null;
    digerBankaIbanNo?: string | null;
    avansLimiti: number;
    avukatTipi?: AvukatTipi | null;
    iletisimVeribanMi: boolean;
    dialogdan: boolean;
    dialogYasal: boolean;
    normal: boolean;
    hesapAktifMi: boolean;
}

export type AvukatKayitDto = Omit<Avukat, 'id' | 'adSoyad'>;

export interface SayfaSonucu<T> {
    totalCount: number;
    items: T[];
}

@Injectable({ providedIn: 'root' })
export class AvukatlarService {
    private http = inject(HttpClient);
    private baseUrl = '/api/avukatlar';

    listele(q: string | null, page = 1, pageSize = 10): Observable<SayfaSonucu<AvukatListDto>> {
        let params = new HttpParams().set('page', page).set('pageSize', pageSize);
        if (q && q.trim()) params = params.set('q', q.trim());

        return this.http.get<any>(this.baseUrl, { params }).pipe(
            map((res: any): SayfaSonucu<AvukatListDto> => ({
                totalCount: res.totalCount ?? 0,
                items: res.items ?? []
            }))
        );
    }

    getir(id: string): Observable<Avukat> {
        return this.http.get<Avukat>(`${this.baseUrl}/${id}`);
    }

    create(dto: AvukatKayitDto): Observable<{ id: string }> {
        return this.http.post<{ id: string }>(this.baseUrl, dto);
    }

    update(id: string, dto: AvukatKayitDto): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}

