import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  AvukatlarService,
  AvukatListDto,
  SayfaSonucu as AvukatSayfaSonucu,
} from '../../services/avukatlar.service';
import {
  UrunlerService,
  UrunListDto,
  SayfaSonucu as UrunSayfaSonucu,
} from '../../services/urunler.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export default class HomeComponent {
  private avukatSrv = inject(AvukatlarService);
  private urunSrv = inject(UrunlerService);

  // Özet sayılar
  avukatToplam = signal(0);
  urunToplam = signal(0);

  // Son 5 kayıt
  avukatlar: AvukatListDto[] = [];
  urunler: UrunListDto[] = [];

  yukleniyorAvukat = signal(false);
  yukleniyorUrun = signal(false);

  constructor() {
    this.yukleAvukatOzet();
    this.yukleUrunOzet();
  }

  private yukleAvukatOzet() {
    this.yukleniyorAvukat.set(true);
    this.avukatSrv.listele(null, 1, 5).subscribe({
      next: (r: AvukatSayfaSonucu<AvukatListDto>) => {
        this.avukatToplam.set(r?.totalCount ?? 0);
        this.avukatlar = (r?.items ?? []).slice(0, 5);
      },
      error: () => { this.avukatToplam.set(0); this.avukatlar = []; },
      complete: () => this.yukleniyorAvukat.set(false)
    });
  }

  private yukleUrunOzet() {
    this.yukleniyorUrun.set(true);
    this.urunSrv.listele(null, 1, 5).subscribe({
      next: (r: UrunSayfaSonucu<UrunListDto>) => {
        this.urunToplam.set(r?.totalCount ?? 0);
        this.urunler = (r?.items ?? []).slice(0, 5);
      },
      error: () => { this.urunToplam.set(0); this.urunler = []; },
      complete: () => this.yukleniyorUrun.set(false)
    });
  }
}
