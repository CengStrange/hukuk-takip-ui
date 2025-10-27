import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AvukatlarService, AvukatListDto, SayfaSonucu } from '../../../services/avukatlar.service';

@Component({
  standalone: true,
  selector: 'app-avukat-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './avukat-list.component.html'
})
export default class AvukatListComponent {
  private srv = inject(AvukatlarService);

  q = '';
  page = 1;
  pageSize = 10;
  data: SayfaSonucu<AvukatListDto> = { totalCount: 0, items: [] };
  silLoadingId = signal<string | null>(null);

  get toplamSayfa() {
    return Math.max(1, Math.ceil(this.data.totalCount / this.pageSize));
  }

  ngOnInit() {
    this.yenile(1);
  }

  yenile(page: number) {
    this.page = Math.max(1, page);
    const term = this.q?.trim() || null;
    this.srv.listele(term, this.page, this.pageSize).subscribe({
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
      error: () => this.silLoadingId.set(null)
    });
  }
}
