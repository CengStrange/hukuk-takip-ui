import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Ihtar,
  IhtarListItemDto,
  IhtarCreateDto,
  IhtarUpdateDto,
  MusteriIhtarDto,
  PagedResult
} from '../core/models/ihtar.model';

@Injectable({ providedIn: 'root' })
export class IhtarlarService {
  private http = inject(HttpClient);
  private base = '/api/Ihtar';

  list(q: string = '', page: number = 1, pageSize: number = 10): Observable<PagedResult<IhtarListItemDto>> {
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (q && q.trim()) {
      params = params.set('q', q.trim());
    }

    return this.http.get<any>(this.base, { params }).pipe(
      map(res => {
        const result: PagedResult<IhtarListItemDto> = {
          page,
          pageSize,
          total: res.totalCount || res.total || 0,
          totalCount: res.totalCount || res.total || 0,
          items: res.items || []
        };
        return result;
      })
    );
  }

  getById(id: number): Observable<Ihtar> {
    return this.http.get<Ihtar>(`${this.base}/${id}`);
  }

  getMusteriIhtarlari(musteriId: string): Observable<MusteriIhtarDto[]> {
    const params = new HttpParams().set('musteriId', musteriId);
    return this.http.get<MusteriIhtarDto[]>(`${this.base}/musteri-ihtarlari`, { params });
  }

  create(dto: IhtarCreateDto): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.base, dto);
  }

  update(id: number, dto: IhtarUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}

