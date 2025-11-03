import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, Observable, of, switchMap, startWith, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { IcraDosyalariService, } from '../../../services/icra-dosyalari.service'; 
import { MusterilerService,  } from '../../../services/musteriler.service';
import { AvukatlarService,  } from '../../../services/avukatlar.service'; 
import { SozlukService,   } from '../../../services/sozluk.service';
import { UrunlerService,  } from '../../../services/urunler.service'; 
import { TakipTipi, TakipTipiText, IcraDurumu, IcraDurumuText, MahiyetKoduTipi, MahiyetKoduTipiText } from '../../../core/models/icra-dosyasi.model';
import { MusteriListDto } from '../../../core/models/musteri.model';
import { AvukatListDto } from '../../../core/models/avukat.model';
import { IcraDosyasi } from '../../../core/models/icra-dosyasi.model';
import { UrunListDto } from '../../../core/models/urun.model';
import { Sehir } from '../../../core/models/sozluk.model';
import { UrunTipiText } from '../../../core/models/urun.model';
import { IcraDairesi } from '../../../core/models/sozluk.model';
import { IcraDosyasiKayitDto } from '../../../core/models/icra-dosyasi.model';

@Component({
  selector: 'app-icra-dosyalari-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form.component.html',
})
export default class IcraDosyalariFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private srv = inject(IcraDosyalariService);
  private sozlukSrv = inject(SozlukService);
  private musteriSrv = inject(MusterilerService);
  private avukatSrv = inject(AvukatlarService);
  private urunlerSrv = inject(UrunlerService); 

  kaydediliyor = signal(false);
  duzenlemeMi = false;
  submitted = false;
  private id: string | null = null; 

  takipTipleri = Object.entries(TakipTipiText);
  icraDurumlari = Object.entries(IcraDurumuText).map(([key, value]) => ({ key: Number(key), value })); 
  mahiyetKodlari = Object.entries(MahiyetKoduTipiText);
  public UrunTipiText = UrunTipiText; 

  sehirler$: Observable<Sehir[]> = this.sozlukSrv.sehirler();
  

  private ihtarliMusteriListesi = signal<MusteriListDto[]>([]); 
  ihtarliUrunler = signal<UrunListDto[]>([]); 

  
  musteriAramaSonuclari = signal<MusteriListDto[]>([]);
  avukatAramaSonuclari = signal<AvukatListDto[]>([]);
  icraDairesiAramaSonuclari = signal<IcraDairesi[]>([]); 
  
  secilenMusteri = signal<MusteriListDto | null>(null);
  secilenAvukat = signal<AvukatListDto | null>(null);
  secilenIcraDairesi = signal<IcraDairesi | null>(null); 
  
  isIcraDairesiDropdownOpen = signal(false);

  frm = this.fb.group({
    dosyaNo: ['', [Validators.required, Validators.maxLength(50)]],
    musteriId: [null as string | null, [Validators.required]],
    avukatId: [null as string | null],
    musteriArama: [''],
    avukatArama: [''],
    avukatTevziNo: ['', [Validators.maxLength(50)]],
    takipTarihi: [null as string | null, [Validators.required]],
    takipTipi: [null as TakipTipi | null, [Validators.required]],
    ihtarBorclulari: ['', [Validators.maxLength(500)]],
    ihtarKonusuUrunler: [null as string | null, [Validators.maxLength(500)]], // <-- Tipi güncellendi (string | null)
    icraMuduruluguSehirId: [null as number | null],
    icraMudurlugu: [null as string | null], 
    icraMudurluguArama: [''], 
    mahiyetKodu: [null as MahiyetKoduTipi | null],
    durum: [IcraDurumu.Acik, [Validators.required]] 
  });

  get f() { return this.frm.controls; }
  constructor() {
    this.id = this.route.snapshot.paramMap.get('id'); 
    this.duzenlemeMi = !!this.id;
  }

  ngOnInit() {
   
    this.musteriSrv.ihtarliMusterileriListele().subscribe(musteriler => {
      this.ihtarliMusteriListesi.set(musteriler);
    });

   
    this.frm.controls.musteriArama.valueChanges.pipe(
      debounceTime(200), 
      distinctUntilChanged(), 
      filter(term => typeof term === 'string')
    ).subscribe(term => {
      if (!term || term.length < 1) {
        this.musteriAramaSonuclari.set([]);
        return;
      }
      const kucukTerm = term.toLowerCase();
      
     
      const filtrelenmis = this.ihtarliMusteriListesi().filter(m => {
      
        const adEslesmesi = m.adiUnvani ? m.adiUnvani.toLowerCase().includes(kucukTerm) : false;
     
        const noEslesmesi = m.musteriNo.toLowerCase().includes(kucukTerm);
        return adEslesmesi || noEslesmesi;
      });
   

      this.musteriAramaSonuclari.set(filtrelenmis.slice(0, 10)); 
    });
 

    this.frm.controls.avukatArama.valueChanges.pipe(
      debounceTime(300), distinctUntilChanged(), filter(term => !!term && term.length >= 2),
      switchMap(term => this.avukatSrv.listele(term, 1, 10))
    ).subscribe(res => this.avukatAramaSonuclari.set(res.items));

    this.frm.controls.icraMuduruluguSehirId.valueChanges.subscribe(() => {
        this.frm.controls.icraMudurlugu.setValue(null);
        this.frm.controls.icraMudurluguArama.setValue('');
        this.secilenIcraDairesi.set(null);
        this.icraDairesiAramaSonuclari.set([]);
    });

    this.frm.controls.icraMudurluguArama.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(term => typeof term === 'string'), 
        switchMap(term => {
            const sehirId = this.frm.controls.icraMuduruluguSehirId.value;
            if (sehirId && (term.length >= 2 || term.length === 0)) {
                return this.sozlukSrv.icraDaireleri({ sehirId: sehirId, q: term || undefined, onlyIcra: true, take: 50 });
            }
            return of([]); 
        })
    ).subscribe(daireler => this.icraDairesiAramaSonuclari.set(daireler));


    if (this.duzenlemeMi) {
      this.kaydediliyor.set(true);
      this.srv.getir(this.id!).pipe( 
        finalize(() => this.kaydediliyor.set(false))
      ).subscribe((data: IcraDosyasi) => { 
        this.frm.patchValue({
          ...data,
          takipTipi: data.takipTipi ?? null, 
          mahiyetKodu: data.mahiyetKodu ?? null,
          ihtarKonusuUrunler: data.ihtarKonusuUrunler ?? null,
          durum: data.durum ?? IcraDurumu.Acik
        });

        if (data.musteriId) {
          
          this.urunlerSrv.getIhtarliUrunler(data.musteriId).subscribe(urunler => {
            this.ihtarliUrunler.set(urunler);
          });
          
          
       
          this.secilenMusteri.set({ id: data.musteriId, adiUnvani: data.musteriAdi || '...', musteriNo: '', borcluTipi: 1 } as MusteriListDto); // DTO'yu tamamlama
          this.frm.controls.musteriArama.setValue(data.musteriAdi || '...');
          this.frm.controls.ihtarBorclulari.setValue(data.musteriAdi || '...'); 
        }
        if (data.avukatId) {
            const adSoyadParts = data.avukatAdiSoyadi?.split(' ') || ['', ''];
            const adi = adSoyadParts[0];
            const soyadi = adSoyadParts.slice(1).join(' ');
            this.secilenAvukat.set({ id: data.avukatId, adi: adi, soyadi: soyadi } as AvukatListDto); 
            this.frm.controls.avukatArama.setValue(`${adi} ${soyadi}`.trim()); 
        }
        if(data.icraMudurlugu) {
            this.frm.controls.icraMudurluguArama.setValue(data.icraMudurlugu);
            this.secilenIcraDairesi.set({ ad: data.icraMudurlugu } as IcraDairesi); 
        }
      });
    }
  }

  onInputNumbersOnly(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

 
  secMusteri(m: MusteriListDto) {
    this.frm.controls.musteriId.setValue(m.id);
    this.frm.controls.ihtarBorclulari.setValue(m.adiUnvani); // <-- İhtar borçlusunu otomatik doldur
    this.secilenMusteri.set(m);
    this.frm.controls.musteriArama.setValue(m.adiUnvani, { emitEvent: false });
    this.musteriAramaSonuclari.set([]);

    -
    this.ihtarliUrunler.set([]); 
    this.frm.controls.ihtarKonusuUrunler.setValue(null); 
    
    this.urunlerSrv.getIhtarliUrunler(m.id).subscribe(urunler => {
      this.ihtarliUrunler.set(urunler);
    });
    
  }

  secAvukat(a: AvukatListDto) {
    this.frm.controls.avukatId.setValue(a.id);
    this.secilenAvukat.set(a);
    this.frm.controls.avukatArama.setValue(`${a.adi} ${a.soyadi}`, { emitEvent: false }); 
    this.avukatAramaSonuclari.set([]);
  }
  
  secIcraDairesi(daire: IcraDairesi) {
    this.frm.controls.icraMudurlugu.setValue(daire.ad); 
    this.secilenIcraDairesi.set(daire);
    this.frm.controls.icraMudurluguArama.setValue(daire.ad, { emitEvent: false }); 
    this.icraDairesiAramaSonuclari.set([]); 
    this.isIcraDairesiDropdownOpen.set(false); 
  }

  onIcraDairesiFocus() {
    this.isIcraDairesiDropdownOpen.set(true);
    if (!this.frm.controls.icraMudurluguArama.value) {
        this.triggerIcraSearch('');
    }
  }

  onIcraDairesiBlur() {
    setTimeout(() => {
        this.isIcraDairesiDropdownOpen.set(false);
    }, 150); 
  }

  private triggerIcraSearch(term: string) {
    const sehirId = this.frm.controls.icraMuduruluguSehirId.value;
    if (sehirId) {
      this.sozlukSrv.icraDaireleri({ sehirId: sehirId, q: term || undefined, onlyIcra: true, take: 50 })
        .subscribe(daireler => this.icraDairesiAramaSonuclari.set(daireler));
    } else {
      this.icraDairesiAramaSonuclari.set([]);
    }
  }

  onSubmit() {
    this.submitted = true;
    this.frm.markAllAsTouched();
    
    if (this.frm.invalid || this.kaydediliyor()) {
      Object.keys(this.frm.controls).forEach(key => {
       const controlErrors = this.frm.get(key)?.errors;
       if (controlErrors) console.log('Hatalı Alan:', key, controlErrors);
      });
      return;
    }

    this.kaydediliyor.set(true);
    const formValue = this.frm.getRawValue();

  
    const payload: IcraDosyasiKayitDto = {
        dosyaNo: formValue.dosyaNo!,
        musteriId: formValue.musteriId!,
        avukatId: formValue.avukatId || null,
        avukatTevziNo: formValue.avukatTevziNo || null,
        takipTarihi: formValue.takipTarihi || null,
        takipTipi: formValue.takipTipi || null,
        ihtarBorclulari: formValue.ihtarBorclulari || null,
        ihtarKonusuUrunler: formValue.ihtarKonusuUrunler || null,
        icraMudurlugu: formValue.icraMudurlugu || null, 
        mahiyetKodu: formValue.mahiyetKodu || null,
        durum: formValue.durum ? Number(formValue.durum) : IcraDurumu.Acik,
    };

    let apiCall$: Observable<unknown>;
    if (this.duzenlemeMi) {
      apiCall$ = this.srv.update(this.id!, payload);
    } else {
      apiCall$ = this.srv.create(payload);
    }

    apiCall$.pipe(
      finalize(() => this.kaydediliyor.set(false))
    ).subscribe({
      next: () => this.router.navigate(['/icra-dosyalari']),
      error: (err) => alert(err?.error?.message || 'Bir hata oluştu.')
    });
  }
}

