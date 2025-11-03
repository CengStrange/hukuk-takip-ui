import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, Observable, of, switchMap, startWith } from 'rxjs';
import { AvukatlarService, } from '../../../services/avukatlar.service';
import { SozlukService } from '../../../services/sozluk.service';
import { NumbersOnlyDirective } from '../../../numbers-only.directive';
import { TelefonMaskDirective } from '../../../appTelefonMask';
import { AvukatKayitDto, AvukatTipi } from '../../../core/models/avukat.model';
import { Sehir, Ilce, Sube } from '../../../core/models/sozluk.model';

@Component({
  standalone: true,
  selector: 'app-avukat-form',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    NumbersOnlyDirective,
    TelefonMaskDirective 
  ],
  templateUrl: './avukat-form.component.html'
})
export default class AvukatFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private srv = inject(AvukatlarService);
  private sozlukSrv = inject(SozlukService);

  kaydediliyor = signal(false);
  duzenlemeMi = false;
  submitted = false;
  private id: string | null = null;

  AvukatTipiEnum = AvukatTipi;
  avukatTipleri = Object.entries(AvukatTipi);
  sehirler$: Observable<Sehir[]> = this.sozlukSrv.sehirler();
  subeler$: Observable<Sube[]> = this.sozlukSrv.subeler();
  ilceler$: Observable<Ilce[]> = of([]);

  frm = this.fb.group({
    adi: ['', [Validators.required, Validators.maxLength(100)]],
    soyadi: ['', [Validators.required, Validators.maxLength(100)]],
    tckn: ['', [Validators.pattern(/^\d{11}$/)]],
    vergiDairesi: ['', [Validators.maxLength(150)]],
    vergiNo: ['', [Validators.pattern(/^\d{10}$/)]],
    email: ['', [Validators.email, Validators.maxLength(200)]],
    dogumTarihi: [null as string | null], 
    cepTelefonu: [''],
    isTelefonu: [''],
    isFaxNo: [''],
    sehirId: [null as number | null],
    ilceId: [null as number | null],
    tamAdres: ['', [Validators.maxLength(500)]],
    avansHesapSubeId: [null as number | null],
    avansHesapNo: ['', [Validators.maxLength(50)]],
    vadesizHesapSubeId: [null as number | null],
    vadesizHesapNo: ['', [Validators.maxLength(50)]],
    halkbankVadesizIbanNo: ['', [Validators.maxLength(26), Validators.pattern(/^TR\d{24}$/)]],
    digerBankaIbanNo: ['', [Validators.maxLength(26), Validators.pattern(/^TR\d{24}$/)]],
    avansLimiti: [0, [Validators.required, Validators.min(0)]],
    avukatTipi: [null as AvukatTipi | null],
   
    hesapAktifMi: [true]
  });
  get f() { return this.frm.controls; }

  constructor() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.duzenlemeMi = !!this.id;

    this.ilceler$ = this.frm.controls.sehirId.valueChanges.pipe(
      startWith(this.frm.controls.sehirId.value),
      switchMap(sehirId => {
        if (sehirId) {
          if (this.frm.controls.ilceId.value) this.frm.controls.ilceId.setValue(null);
          return this.sozlukSrv.ilceler(sehirId);
        }
        return of([]);
      })
    );

    if (this.duzenlemeMi) {
      this.kaydediliyor.set(true);
      this.srv.getir(this.id!).pipe(
        finalize(() => this.kaydediliyor.set(false))
      ).subscribe(avukat => {
        this.frm.patchValue(avukat);
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.frm.invalid || this.kaydediliyor()) {
      return;
    }

    this.kaydediliyor.set(true);
    const formValue = this.frm.getRawValue();

    const cepTelefonuTemiz = (formValue.cepTelefonu || '').replace(/\D/g, '');
    const isTelefonuTemiz = (formValue.isTelefonu || '').replace(/\D/g, '');
    const isFaxNoTemiz = (formValue.isFaxNo || '').replace(/\D/g, '');

    const payload: AvukatKayitDto = {
        adi: formValue.adi!,
        soyadi: formValue.soyadi!,
        tckn: formValue.tckn || null, 
        vergiDairesi: formValue.vergiDairesi || null,
        vergiNo: formValue.vergiNo || null, 
        email: formValue.email || null,
        dogumTarihi: formValue.dogumTarihi,
        cepTelefonu: cepTelefonuTemiz || null,
        isTelefonu: isTelefonuTemiz || null,
        isFaxNo: isFaxNoTemiz || null,
        sehirId: formValue.sehirId,
        ilceId: formValue.ilceId,
        tamAdres: formValue.tamAdres || null,
        avansHesapSubeId: formValue.avansHesapSubeId,
        avansHesapNo: formValue.avansHesapNo || null,
        vadesizHesapSubeId: formValue.vadesizHesapSubeId,
        vadesizHesapNo: formValue.vadesizHesapNo || null,
        halkbankVadesizIbanNo: formValue.halkbankVadesizIbanNo || null,
        digerBankaIbanNo: formValue.digerBankaIbanNo || null,
        avansLimiti: Number(formValue.avansLimiti),
        avukatTipi: formValue.avukatTipi,
        hesapAktifMi: formValue.hesapAktifMi ?? true,
    };

    let apiCall$: Observable<any>;
    if (this.duzenlemeMi) {
      apiCall$ = this.srv.update(this.id!, payload);
    } else {
      apiCall$ = this.srv.create(payload);
    }

    apiCall$.pipe(
      finalize(() => this.kaydediliyor.set(false))
    ).subscribe({
      next: () => this.router.navigate(['/avukatlar']),
      error: (err) => alert(err?.error?.message || 'Bir hata oluştu.') 
    });
  }
}
