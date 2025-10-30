import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MusterilerService, Musteri, MusteriTuru, BorcluTipi, MusteriListDto } from '../../../services/musteriler.service';
import { SozlukService, Ilce } from '../../../services/sozluk.service';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { take, debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';

// Direktif importları kaldırıldı

@Component({
  standalone: true,
  selector: 'app-musteri-form',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink
    // Direktifler import listesinden kaldırıldı
  ],
  templateUrl: './form.component.html'
})
export default class MusteriFormComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private srv = inject(MusterilerService);
  private sozluk = inject(SozlukService);

  kaydediliyor = signal(false);
  duzenlemeMi = false;
  submitted = false;
  private id: string | null = null;

  sehirler$: Observable<{ id: number; ad: string }[]> = of([]);
  ilceler$: Observable<Ilce[]> =of([]);
  nufusaKayitliOlduguIl$: Observable<{ id: number; ad: string }[]> = of([]);
  
  musteriAramaSonuclari = signal<MusteriListDto[]>([]);
  private aramaSubject = new Subject<string>();
  private aramaSubscription: Subscription;

  frm = this.fb.group({
    musteriId: [null as string | null],
    musteriNo: ['', [Validators.required, Validators.maxLength(50)]],
    adiUnvani: ['', [Validators.maxLength(200)]],
    borcluTipi: [BorcluTipi.AsilKrediBorclusu, [Validators.required]],
    borcluSoyadi: [''],
    tckn: [''],
    dogumTarihi: [null as string | null],
    dogumTarihiDisplay: [''],
    dogumYeri: [''],
    cinsiyet: [null as number | null],
    medeniDurum: [null as number | null],
    babaAdi: [''],
    anneAdi: [''],
    pasaportNumarasi: [''],
    kimlikVerilisTarihi: [null as string | null],
    nufusaKayitliOlduguIl: [''],
  
    sehirId: [null as number | null],
    ilceId: [null as number | null],
    semt: [''],
    vergiDairesi: [''],
    vergiNo: [''],
    sskNo: [''],
    sskIsyeriNumarasi: [''],
    ticaretSicilNo: [''],
    borcuTipi: [''], 
    musteriMusteriTipi: [MusteriTuru.Bireysel, [Validators.required]],
    hayattaMi: [true]
  });

  get musteriMusteriTipi() { return this.frm.controls.musteriMusteriTipi; }
  get tckn() { return this.frm.controls.tckn; }
  get vergiNo() { return this.frm.controls.vergiNo; }

  constructor() {
    this.sehirler$ = this.sozluk.sehirler();

    this.ilceler$ = this.frm.controls.sehirId.valueChanges.pipe(
      startWith(this.frm.controls.sehirId.value),
      switchMap(sehirId => {
        if (sehirId) {
          if (this.frm.controls.ilceId.value) {
            this.frm.controls.ilceId.setValue(null);
          }
          return this.sozluk.ilceler(sehirId);
        }
        return of([]);
      })
    );

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.duzenlemeMi = true;
      this.id = idParam;
      this.kaydediliyor.set(true);
      this.srv.getir(this.id).pipe(take(1)).subscribe({
        next: m => {
          const patchData = {
            ...m,
            dogumTarihi: m.dogumTarihi ? m.dogumTarihi.split('T')[0] : null,
            kimlikVerilisTarihi: m.kimlikVerilisTarihi ? m.kimlikVerilisTarihi.split('T')[0] : null
          };
          this.frm.patchValue(patchData as any);
        },
        error: () => alert('Müşteri verisi alınamadı.'),
        complete: () => this.kaydediliyor.set(false)
      });
    }
    this.nufusaKayitliOlduguIl$ = this.sozluk.sehirler();

    this.musteriMusteriTipi.valueChanges.subscribe(val => {
      this.applyMusteriTipiValidators(Number(val));
    });
    this.applyMusteriTipiValidators(Number(this.musteriMusteriTipi.value));
    
    this.aramaSubscription = this.aramaSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.length < 2) {
          return of({ items: [], totalCount: 0 });
        }
        return this.srv.listele(term, 1, 10);
      })
    ).subscribe(sonuc => {
      this.musteriAramaSonuclari.set(sonuc.items);
    });
  }

  ngOnDestroy() {
    this.aramaSubscription.unsubscribe();
  }

  onInputNumbersOnly(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  araMusteri(term: string) {
    this.aramaSubject.next(term);
  }

  secMusteri(musteri: MusteriListDto) {
    this.frm.controls.musteriId.setValue(musteri.id);
    this.musteriAramaSonuclari.set([]);
  }

  private applyMusteriTipiValidators(val: number) {
    if (val === MusteriTuru.Bireysel) {
      this.tckn.setValidators([Validators.required, Validators.pattern(/^\d{11}$/)]);
      this.vergiNo.clearValidators(); this.vergiNo.setValue('');
    } else { // Kurumsal
      this.vergiNo.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
      this.tckn.clearValidators(); this.tckn.setValue('');
    }
    this.tckn.updateValueAndValidity();
    this.vergiNo.updateValueAndValidity();
  }
  

  onSubmit() {
    this.submitted = true;
    if (this.frm.invalid) {
      console.error('Form geçersiz, kaydetme işlemi durduruldu.');
      Object.keys(this.frm.controls).forEach(key => {
        const controlErrors = this.frm.get(key)?.errors;
        if (controlErrors != null) {
          console.log('Hatalı Alan:', key, controlErrors);
        }
      });
      return;
    }

    if (this.kaydediliyor()) return;
    
    this.kaydediliyor.set(true);

    const formValue = this.frm.getRawValue();
  
    const tcknTemiz = (formValue.tckn || '').replace(/\D/g, '');
    const vergiNoTemiz = (formValue.vergiNo || '').replace(/\D/g, '');
    const sskNoTemiz = (formValue.sskNo || '').replace(/\D/g, '');
    const sskIsyeriNumarasiTemiz = (formValue.sskIsyeriNumarasi || '').replace(/\D/g, '');
    const ticaretSicilNoTemiz = (formValue.ticaretSicilNo || '').replace(/\D/g, '');

    const payload: Partial<Musteri> = {
      ...formValue,
      tckn: tcknTemiz || null,
      vergiNo: vergiNoTemiz || null,
      sskNo: sskNoTemiz || null,
      sskIsyeriNumarasi: sskIsyeriNumarasiTemiz || null,
      ticaretSicilNo: ticaretSicilNoTemiz || null,
      musteriNo: formValue.musteriNo!,
      borcluTipi: formValue.borcluTipi!,
      musteriMusteriTipi: formValue.musteriMusteriTipi!,
      hayattaMi: formValue.hayattaMi!,
      sehirId:formValue.sehirId,
      ilceId:formValue.ilceId,
      nufusaKayitliOlduguIl:formValue.nufusaKayitliOlduguIl
    };
    
    if (this.duzenlemeMi && this.id) {
      this.srv.update(this.id, payload).pipe(take(1)).subscribe({
        next: () => this.router.navigate(['/musteriler']),
        error: (err: any) => {
          alert(this.hataMesaji(err));
          this.kaydediliyor.set(false);
        }
      });
    } else {
      this.srv.create(payload).pipe(take(1)).subscribe({
        next: () => this.router.navigate(['/musteriler']),
        error: (err: any) => {
          alert(this.hataMesaji(err));
          this.kaydediliyor.set(false);
        }
      });
    }
  }

  private hataMesaji(err: any): string {
    const msg = err?.error?.message || err?.error || err?.message || 'Bir hata oluştu.';
    return typeof msg === 'string' ? msg : 'İşlem başarısız.';
  }
}

