import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IcraDosyalariService } from '../../../services/icra-dosyalari.service';
import { IcraDurumuText, TakipTipiText, IcraDosyasiListItem, SayfaSonucu } from '../../../core/models/icra-dosyasi.model';
import { finalize } from 'rxjs'; 

@Component({
  selector: 'app-icra-dosyalari-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './list.component.html',
})
export default class IcraDosyalariListComponent {
  private srv = inject(IcraDosyalariService);

  public icraDurumuText = IcraDurumuText;
  public takipTipiText = TakipTipiText; 
  public readonly Math = Math; 

  q = '';
  page = 1;
  pageSize = 10;
  data: SayfaSonucu<IcraDosyasiListItem> = { totalCount: 0, items: [] };
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
    const term = this.q?.trim() || undefined; 
    
    this.loading.set(true);
    
    this.srv.listele({ q: term, page: this.page, pageSize: this.pageSize }).pipe(
      finalize(() => this.loading.set(false)) 
    ).subscribe({
      next: (res) => this.data = res,
      error: () => this.data = { totalCount: 0, items: [] }
    });
  }

  ara() { this.yenile(1); }
  temizle() { this.q = ''; this.yenile(1); }

  sil(icra: IcraDosyasiListItem) {
    if (!confirm(`"${icra.dosyaNo}" numaralı icra dosyasını silmek istiyor musunuz?`)) return;
    this.silLoadingId.set(icra.id);
    this.srv.delete(icra.id).subscribe({
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
