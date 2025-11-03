import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AvukatlarService,   } from '../../../services/avukatlar.service';
import { finalize } from 'rxjs'; 
import { AvukatListDto, AvukatTipiText,SayfaSonucu } from '../../../core/models/avukat.model';


@Component({
  standalone: true,
  selector: 'app-avukat-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './avukat-list.component.html'
})

export default class AvukatListComponent {
  private srv = inject(AvukatlarService);

  public avukatTipiTextMap = AvukatTipiText;
  public readonly Math = Math;

  q = '';
  page = 1;
  pageSize = 10;
 
  data: SayfaSonucu<AvukatListDto> = { totalCount: 0, items: [] };
  silLoadingId = signal<string | null>(null);

 
  loading = signal(false);

  get toplamSayfa() {
    return Math.max(1, Math.ceil(this.data.totalCount / this.pageSize));
  }

  ngOnInit() {
    this.yenile(1);
  }

  yenile(page: number) {
    this.page = Math.max(1, page);
    const term = this.q?.trim() || null;

    this.loading.set(true); 

    this.srv.listele(term, this.page, this.pageSize).pipe(
      finalize(() => this.loading.set(false)) 
    ).subscribe({
      next: (res) => this.data = res,
      error: () => this.data = { totalCount: 0, items: [] }
    });
  }

  ara() { this.yenile(1); }
  temizle() { this.q = ''; this.yenile(1); }

  sil(a: AvukatListDto) {
    if (!confirm(`"${a.adi} ${a.soyadi}" kaydını silmek istiyor musunuz?`)) return;
    
    this.silLoadingId.set(a.id);
    
    this.srv.delete(a.id).subscribe({
      next: () => {
        this.silLoadingId.set(null);
        this.yenile(this.page);
      },
      error: (e) => {
        this.silLoadingId.set(null);
        alert('Silme hatası: ' + (e?.error?.message || 'Bilinmeyen hata'));
      }
    });
  }
}

