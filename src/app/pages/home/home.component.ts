import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvukatlarService } from '../../services/avukatlar.service';
import { UrunlerService } from '../../services/urunler.service';
import { MusterilerService } from '../../services/musteriler.service';
import { IcraDosyalariService } from '../../services/icra-dosyalari.service';
import { IhtarlarService } from '../../services/ihtarlar.service'; 
import { AvukatListDto, SayfaSonucu as AvukatSayfaSonucu } from '../../core/models/avukat.model';
import { MusteriListDto, SayfaSonucu as MusteriSayfaSonucu } from '../../core/models/musteri.model';
import { UrunListDto, SayfaSonucu as UrunSayfaSonucu } from '../../core/models/urun.model'; 
import { IcraDosyasiListItem, SayfaSonucu as IcraSayfaSonucu } from '../../core/models/icra-dosyasi.model';
import { IhtarListItemDto, PagedResult as IhtarSayfaSonucu } from '../../core/models/ihtar.model';


@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export default class HomeComponent {

  private avukatSrv = inject(AvukatlarService);
  private urunSrv = inject(UrunlerService);
  private musteriSrv = inject(MusterilerService);
  private icraSrv = inject(IcraDosyalariService);
  private ihtarSrv = inject(IhtarlarService); 

  avukatToplam = signal(0);
  urunToplam = signal(0);
  musteriToplam = signal(0);
  icraToplam = signal(0);
  ihtarToplam = signal(0); 

  yukleniyorAvukat = signal(false);
  yukleniyorUrun = signal(false);
  yukleniyorMusteri = signal(false);
  yukleniyorIcra = signal(false);
  yukleniyorIhtar = signal(false); 

  constructor() {
    this.yukleAvukatOzet();
    this.yukleUrunOzet();
    this.yukleMusteriOzet();
    this.yukleIcraOzet();
    this.yukleIhtarOzet(); 
  }

  private yukleAvukatOzet() {
    this.yukleniyorAvukat.set(true);
    this.avukatSrv.listele(null, 1, 1).subscribe({
      next: (r: AvukatSayfaSonucu<AvukatListDto>) => {
        this.avukatToplam.set(r?.totalCount ?? 0);
      },
      error: () => this.avukatToplam.set(0),
      complete: () => this.yukleniyorAvukat.set(false)
    });
  }

  private yukleUrunOzet() {
    this.yukleniyorUrun.set(true);
    this.urunSrv.listele(null, 1, 1).subscribe({
      next: (r: UrunSayfaSonucu<UrunListDto>) => {
        this.urunToplam.set(r?.totalCount ?? 0);
      },
      error: () => this.urunToplam.set(0),
      complete: () => this.yukleniyorUrun.set(false)
    });
  }

  private yukleMusteriOzet() {
    this.yukleniyorMusteri.set(true);
    this.musteriSrv.listele(null, 1, 1).subscribe({
      next: (r: MusteriSayfaSonucu<MusteriListDto>) => {
        this.musteriToplam.set(r?.totalCount ?? 0);
      },
      error: () => this.musteriToplam.set(0),
      complete: () => this.yukleniyorMusteri.set(false)
    });
  }

  private yukleIcraOzet() {
    this.yukleniyorIcra.set(true);
    this.icraSrv.listele().subscribe({
      next: (r: IcraSayfaSonucu<IcraDosyasiListItem>) => {
        this.icraToplam.set(r?.totalCount ?? 0);
      },
      error: () => this.icraToplam.set(0),
      complete: () => this.yukleniyorIcra.set(false)
    });
  }

  
  private yukleIhtarOzet() {
    this.yukleniyorIhtar.set(true);
    
  
    this.ihtarSrv.list('', 1, 1).subscribe({
      next: (r: IhtarSayfaSonucu<IhtarListItemDto>) => {
        this.ihtarToplam.set(r?.totalCount ?? 0);
      },
      error: () => this.ihtarToplam.set(0),
      complete: () => this.yukleniyorIhtar.set(false)
    });
  }
}
 
