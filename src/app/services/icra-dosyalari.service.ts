import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,  map } from 'rxjs';
import { IcraDosyasi, IcraDosyasiKayitDto, IcraDosyasiListItem, SayfaSonucu } from '../core/models/icra-dosyasi.model';


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
