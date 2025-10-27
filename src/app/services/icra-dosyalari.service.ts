import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export enum TakipTipi {
    IlamsizTakip = 'IlamsizTakip',
    IlamliTakip = 'IlamliTakip',

}

export const TakipTipiText: { [key in TakipTipi]: string } = {
    [TakipTipi.IlamsizTakip]: 'İlamsız Takip',
    [TakipTipi.IlamliTakip]: ' İlamlı Takip',
};

export enum IcraDurumu {
    Acik = 1,
    Takipte = 2,
    Tahsil = 3,
    Kapandi = 4
}

export const IcraDurumuText: { [key in IcraDurumu]: string } = {
    [IcraDurumu.Acik]: 'Açık',
    [IcraDurumu.Takipte]: 'Takipte',
    [IcraDurumu.Tahsil]: 'Tahsil',
    [IcraDurumu.Kapandi]: 'Kapandı'
 
};
export enum MahiyetKoduTipi {
    TüketiciHakemHeyeti = 'TüketiciHakemHeyeti',
    KrediKarti = 'KrediKarti',
    ParaAlacagı = 'ParaAlacagı',
    KrediSozlesmesi = 'KrediSozlesmesi',
    Diger = 'Diger',
    Belgesiz='Belgesiz'
}
export const MahiyetKoduTipiText: { [key in MahiyetKoduTipi]: string } = {
    [MahiyetKoduTipi.TüketiciHakemHeyeti]: '1- Tüketici Hakem Heyeti',
    [MahiyetKoduTipi.KrediKarti]: '2- Kredi Kartı',
    [MahiyetKoduTipi.ParaAlacagı]: '3- ParaAlacagı',
    [MahiyetKoduTipi.KrediSozlesmesi]: '4 - Kredi Sözleşmesi',
    [MahiyetKoduTipi.Diger]: '5 - Diğer',
    [MahiyetKoduTipi.Belgesiz]: '6 - Belgesiz'
};


export interface IcraDosyasiListItem {
    id: string; 
    dosyaNo: string;
    musteriAdi: string;
    avukatAdiSoyadi?: string | null;
    durum: IcraDurumu;
}

export interface IcraDosyasi extends IcraDosyasiListItem {
    musteriId: string; 
    avukatId?: string | null; 
    avukatTevziNo?: string | null;
    takipTarihi?: string | null; 
    takipTipi?: TakipTipi | null;
    ihtarBorclulari?: string | null;
    ihtarKonusuUrunler?: string | null;
    icraMudurlugu?: string | null;
    mahiyetKodu?: MahiyetKoduTipi | null;
}


export interface IcraDosyasiKayitDto {
    dosyaNo: string;
    musteriId: string; 
    avukatId: string | null; 
    avukatTevziNo: string | null;
    takipTarihi: string | null; 
    takipTipi: TakipTipi | null;
    ihtarBorclulari: string | null;
    ihtarKonusuUrunler: string | null;
    icraMudurlugu: string | null;
    mahiyetKodu: MahiyetKoduTipi | null;
    durum: IcraDurumu;
}

export interface SayfaSonucu<T> {
    totalCount: number;
    items: T[];
}


@Injectable({ providedIn: 'root' })
export class IcraDosyalariService {
    private http = inject(HttpClient);
    private baseUrl = '/api/IcraDosyalari';

    listele(params?: { q?: string; page?: number; pageSize?: number }): Observable<SayfaSonucu<IcraDosyasiListItem>> {
        return this.http.get<any>(this.baseUrl, { params: params as any }).pipe(
            map(res => ({
                totalCount: res.totalCount ?? 0,
                items: res.items ?? []
            }))
        );
    }

    getir(id: string): Observable<IcraDosyasi> {
        return this.http.get<IcraDosyasi>(`${this.baseUrl}/${id}`);
    }

    create(dto: IcraDosyasiKayitDto): Observable<{ id: string }> {
        return this.http.post<{ id: string }>(this.baseUrl, dto);
    }

    update(id: string, dto: IcraDosyasiKayitDto): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
