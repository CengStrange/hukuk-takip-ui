import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IhtarListItemDto, IhtarCreateDto, IhtarUpdateDto, PagedResult } from '../core/models/ihtar.model';

@Injectable({ providedIn: 'root' })
export class IhtarlarService {
  private http = inject(HttpClient);
  private base = '/api/Ihtar';

  list(q = '', page = 1, pageSize = 10): Observable<PagedResult<IhtarListItemDto>> {
    let params = new HttpParams().set('take', pageSize);
    if (q && q.trim()) params = params.set('q', q.trim());

    return this.http.get<IhtarListItemDto[]>(this.base, { params, observe: 'response' as const }).pipe(
      map(resp => {
        const items = resp.body ?? [];
        const totalHeader = resp.headers.get('X-Total-Count');
        const total = totalHeader ? Number(totalHeader) : items.length;

        const result: PagedResult<IhtarListItemDto> = {
          page,
          pageSize,
          total,     
          totalCount: total, 
          items
        } as PagedResult<IhtarListItemDto>;

        return result;
      })
    );
  }

  getById(id: number) {
    return this.http.get<IhtarCreateDto>(`${this.base}/${id}`);
  }

  create(dto: IhtarCreateDto) {
    return this.http.post<number>(this.base, dto);
  }

  update(id: number, dto: IhtarUpdateDto) {
    return this.http.put<void>(`${this.base}/${id}`, dto);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
