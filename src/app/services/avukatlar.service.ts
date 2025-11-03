import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Avukat, AvukatKayitDto, AvukatListDto, SayfaSonucu  } from '../core/models/avukat.model';


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

