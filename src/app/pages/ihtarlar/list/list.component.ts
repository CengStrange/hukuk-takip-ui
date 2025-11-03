import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IhtarlarService } from '../../../services/ihtarlar.service';
import { IhtarListItemDto } from '../../../core/models/ihtar.model';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-ihtar-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './list.component.html',
})
export default class ListComponent {
  private api = inject(IhtarlarService);

  public readonly Math = Math;

  arama = signal<string>('');
  sayfa = signal<number>(1);
  sayfaBoyutu = signal<number>(10);
  yukleniyor = signal<boolean>(false);
  toplam = signal<number>(0);
  kayitlar = signal<IhtarListItemDto[]>([]);

  constructor() {
    effect(() => {
      this.arama();
      this.sayfa();
      this.sayfaBoyutu();
      void this.yukle();
    });
  }

  async yukle() {
    this.yukleniyor.set(true);
    try {
      const res = await firstValueFrom(
        this.api.list(this.arama(), this.sayfa(), this.sayfaBoyutu())
      );
      this.kayitlar.set(res.items);
      this.toplam.set(res.totalCount);
    } catch (err) {
      console.error(err);
      this.kayitlar.set([]);
      this.toplam.set(0);
    } finally {
      this.yukleniyor.set(false);
    }
  }

  ara() {
    this.sayfa.set(1);
  }

  sil(id: number) {
    if (!confirm('Bu ihtarı silmek istediğine emin misin?')) return;
    this.api.remove(id).subscribe({
      next: () => this.yukle(),
      error: (e) =>
        alert('Silme sırasında hata oluştu: ' + (e?.error || e?.message || '')),
    });
  }

  sonOdemeBadge(k: IhtarListItemDto) {
    return (k as any).sonOdemeTarihi ? (k as any).sonOdemeTarihi : 'YOK';
  }
}

