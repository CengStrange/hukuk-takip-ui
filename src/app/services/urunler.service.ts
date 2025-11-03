import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Urun,UrunKayitDto,UrunListDto,UrunUpdateDto,SayfaSonucu } from '../core/models/urun.model';
   


@Injectable({ providedIn: 'root' })
export class UrunlerService {
    private http = inject(HttpClient);
    private baseUrl = '/api/urunler';


    listele(
        q: string | null,
        page = 1,
        pageSize = 10,
        musteriId: string | null = null 
    ): Observable<SayfaSonucu<UrunListDto>> {
        
        let params = new HttpParams().set('page', page).set('pageSize', pageSize);
        if (q && q.trim()) params = params.set('q', q.trim());
        
       
        if (musteriId) {
            params = params.set('musteriId', musteriId); 
        }

        return this.http.get<any>(this.baseUrl, { params }).pipe(
            map((res: any): SayfaSonucu<UrunListDto> => ({
                totalCount: res.total ?? 0,
                items: res.items ?? []
            }))
        );
    }
    

    getIhtarliUrunler(musteriId: string): Observable<UrunListDto[]> {
        let params = new HttpParams().set('musteriId', musteriId);
        return this.http.get<UrunListDto[]>(`${this.baseUrl}/ihtarli-urunler`, { params });
    }


    getir(id: string): Observable<Urun> {
        return this.http.get<Urun>(`${this.baseUrl}/${id}`);
    }

    create(dto: UrunKayitDto): Observable<{ id: string }> {
        return this.http.post<{ id: string }>(this.baseUrl, dto);
    }

    update(id: string, dto: UrunUpdateDto): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}


