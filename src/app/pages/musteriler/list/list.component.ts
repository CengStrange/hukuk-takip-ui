import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MusterilerService} from '../../../services/musteriler.service';
import { MusteriListDto ,SayfaSonucu} from '../../../core/models/musteri.model';

@Component({
  standalone: true,
  selector: 'app-musteri-list',
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './list.component.html', 
})
export default class MusteriListComponent {
  private api = inject(MusterilerService);

  q = '';
  page = 1;
  pageSize = 10;


  loading = false;
  data: SayfaSonucu<MusteriListDto> = { totalCount: 0, items: [] };
  silLoadingId: string | null = null;

  get toplamSayfa() {

    return Math.max(1, Math.ceil(this.data.totalCount / this.pageSize));
  }

  ngOnInit() {
    this.yenile(1);
  }

  yenile(page: number) {
    this.page = Math.max(1, page);
    const term = this.q?.trim() || null;
    this.loading = true;

    this.api.listele(term, this.page, this.pageSize).subscribe({
      next: (res) => {

        this.data = res;
      },
      error: () => {
       
        this.data = { totalCount: 0, items: [] };
      },
      complete: () => (this.loading = false),
    });
  }

  ara() {
    this.yenile(1);
  }

  temizle() {
    this.q = '';
    this.yenile(1);
  }

  delete(m: MusteriListDto) {
    if (!confirm(`"${m.musteriNo} - ${m.adiUnvani ?? ''}" kaydını silmek istiyor musunuz?`)) return;

    this.silLoadingId = m.id;
    this.api.delete(m.id).subscribe({
      next: () => {
        this.silLoadingId = null;
        this.yenile(this.page);
        alert('Silindi.'); 
      },
      error: (e) => {
        this.silLoadingId = null;
        alert('Silme hatası: ' + (e?.error?.message || e?.message || 'Bilinmeyen bir hata oluştu.')); // Orijinal kodunuzdaki alert bırakıldı
      },
    });
  }
}
