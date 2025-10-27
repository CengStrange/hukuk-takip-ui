import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvukatlarService, SayfaSonucu as AvSayfa, AvukatListDto } from '../../services/avukatlar.service';
import { UrunlerService, SayfaSonucu as UrSayfa, UrunListDto } from '../../services/urunler.service';
import { MusterilerService, SayfaSonucu as MsSayfa, } from '../../services/musteriler.service';
import { HealthService } from '../../services/health.service';
import { MusteriListDto } from '../../core/models/musteri.model';
import { IhtarlarService } from '../../services/ihtarlar.service';
import { IhtarListItemDto } from '../../core/models/ihtar.model';


@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export default class DashboardComponent {
  private avSrv = inject(AvukatlarService);
  private urSrv = inject(UrunlerService);
  private msSrv = inject(MusterilerService);
  private health = inject(HealthService);
  private ihtarApi = inject(IhtarlarService);


  loading = signal(true);
  apiUp = signal<boolean | null>(null);
  toplamIhtar = signal<number>(0);
  sonIhtarlar = signal<IhtarListItemDto[]>([]); 

  avToplam = signal(0);
  urToplam = signal(0);
  msToplam = signal(0);

  sonAvukatlar: AvukatListDto[] = [];
  sonUrunler: UrunListDto[] = [];
  sonMusteriler: MusteriListDto[] = [];

  constructor() {
  
    this.health.ping().subscribe({ next: () => this.apiUp.set(true), error: () => this.apiUp.set(false) });

    this.avSrv.listele(null, 1, 5).subscribe({
      next: (r: AvSayfa<AvukatListDto>) => { this.avToplam.set(r?.totalCount ?? 0); this.sonAvukatlar = r?.items ?? []; },
      error: () => { this.avToplam.set(0); this.sonAvukatlar = []; }
    });

    this.urSrv.listele(null, 1, 5).subscribe({
      next: (r: UrSayfa<UrunListDto>) => { this.urToplam.set(r?.totalCount ?? 0); this.sonUrunler = r?.items ?? []; },
      error: () => { this.urToplam.set(0); this.sonUrunler = []; }
    });

    this.msSrv.listele(null, 1, 5).subscribe({
      next: (r: MsSayfa<MusteriListDto>) => { this.msToplam.set(r?.totalCount ?? 0); this.sonMusteriler = r?.items ?? []; },
      error: () => { this.msToplam.set(0); this.sonMusteriler = []; },
      complete: () => this.loading.set(false),
    });
    this.ihtarApi.list('', 1, 5).subscribe((res) => {
    this.toplamIhtar.set(res.totalCount);
    this.sonIhtarlar.set(res.items);
    });
  }
}
