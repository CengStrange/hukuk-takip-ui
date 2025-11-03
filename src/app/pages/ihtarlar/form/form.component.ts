import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {Subject, Subscription } from 'rxjs';
import { take, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MusteriListDto } from '../../../core/models/musteri.model';
import { IhtarlarService } from '../../../services/ihtarlar.service';
import { MusterilerService } from '../../../services/musteriler.service';
import { IhtarCreateDto, IhtarUpdateDto } from '../../../core/models/ihtar.model';
import { of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-ihtar-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  providers: [DatePipe],
  templateUrl: './form.component.html'
})
export default class IhtarFormComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ihtarlarSrv = inject(IhtarlarService);
  private musterilerSrv = inject(MusterilerService);
  private datePipe = inject(DatePipe);

  kaydediliyor = signal(false);
  duzenlemeMi = false;
  submitted = false;
  private id: number | null = null;

  musteriAramaSonuclari = signal<MusteriListDto[]>([]);
  private aramaSubject = new Subject<string>();
  private aramaSubscription: Subscription;

  frm = this.fb.group({
    musteriId: [null as string | null, [Validators.required]],
    musteriSeciliAdi: [{ value: '', disabled: true }],
    musteriUrunleri: ['' as string | null],
    noterAdi: ['' as string | null, [Validators.maxLength(100)]],
    yevmiyeNo: ['' as string | null, [Validators.maxLength(50)]],
    ihtarTarihi: [null as string | null, [Validators.required]],
    ihtarnameSuresiGun: [null as number | null, [Validators.min(0)]],
    tebligTarihi: [null as string | null],
    ihtarTebligGirisTarihi: [null as string | null],
    katTarihi: [null as string | null],
    ihtarnameNakitTutar: [0, [Validators.required, Validators.min(0)]],
    ihtarnameGayriNakitTutar: [0, [Validators.required, Validators.min(0)]],
    ihtarNo: ['' as string | null, [Validators.maxLength(50)]]
  });
  get f() { return this.frm.controls; }
  constructor() {
    this.aramaSubscription = this.aramaSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.length < 2) {
          return of({ items: [], totalCount: 0 });
        }
        return this.musterilerSrv.listele(term, 1, 10);
      })
    ).subscribe(sonuc => {
      this.musteriAramaSonuclari.set(sonuc.items);
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.duzenlemeMi = true;
      this.id = +idParam;
      this.kaydediliyor.set(true);

      this.ihtarlarSrv.getById(this.id).pipe(take(1)).subscribe({
        next: ihtar => {
          this.frm.patchValue({
            musteriId: ihtar.musteriId,
            musteriSeciliAdi: ihtar.musteri?.adiUnvani || 'Müşteri Bulunamadı',
            musteriUrunleri: ihtar.musteriUrunleri,
            noterAdi: ihtar.noterAdi,
            yevmiyeNo: ihtar.yevmiyeNo,
            ihtarTarihi: this.formatDate(ihtar.ihtarTarihi),
            ihtarnameSuresiGun: ihtar.ihtarnameSuresiGun,
            tebligTarihi: this.formatDate(ihtar.tebligTarihi),
            ihtarTebligGirisTarihi: this.formatDate(ihtar.ihtarTebligGirisTarihi),
            katTarihi: this.formatDate(ihtar.katTarihi),
            ihtarnameNakitTutar: ihtar.ihtarnameNakitTutar,
            ihtarnameGayriNakitTutar: ihtar.ihtarnameGayriNakitTutar,
            ihtarNo: ihtar.ihtarNo
          });
        },
        error: () => alert('İhtar verisi alınamadı.'),
        complete: () => this.kaydediliyor.set(false)
      });
    }
  }

  ngOnDestroy() {
    this.aramaSubscription.unsubscribe();
  }

  private formatDate(date: string | null | undefined): string | null {
    if (!date) return null;
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  araMusteri(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.aramaSubject.next(term);
  }

  secMusteri(musteri: MusteriListDto) {
    this.frm.controls.musteriId.setValue(musteri.id);
    this.frm.controls.musteriSeciliAdi.setValue(musteri.adiUnvani);
    this.musteriAramaSonuclari.set([]);
    const aramaInput = document.getElementById('musteriAramaInput') as HTMLInputElement;
    if (aramaInput) aramaInput.value = '';
  }

  temizleMusteri() {
    this.frm.controls.musteriId.setValue(null);
    this.frm.controls.musteriSeciliAdi.setValue('');
  }

  onInputNumbersOnly(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
  
  onSubmit() {
    this.submitted = true;
    this.frm.markAllAsTouched();
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

    const payload = {
      ...formValue,
      musteriId: formValue.musteriId!,
    };
    
    delete (payload as any).musteriSeciliAdi; 

    if (this.duzenlemeMi && this.id) {
      this.ihtarlarSrv.update(this.id, payload as IhtarUpdateDto).pipe(take(1)).subscribe({
        next: () => this.router.navigate(['/ihtarlar']),
        error: (err: any) => {
          alert(this.hataMesaji(err));
          this.kaydediliyor.set(false);
        }
      });
    } else {
      this.ihtarlarSrv.create(payload as IhtarCreateDto).pipe(take(1)).subscribe({
        next: () => this.router.navigate(['/ihtarlar']),
        error: (err: any) => {
          alert(this.hataMesaji(err));
          this.kaydediliyor.set(false);
        }
      });
    }
  }

  private hataMesaji(err: any): string {
    if (err.status === 409) {
      return err.error || "Aynı noter ve yevmiye numarası zaten mevcut.";
    }
    if (err.status === 400) {
      if (err.error?.errors) {
         return Object.values(err.error.errors).join('\n');
      }
      return err.error || 'Geçersiz veri. Lütfen alanları kontrol edin.';
    }
    const msg = err?.error?.message || err?.error || err?.message || 'Bir hata oluştu.';
    return typeof msg === 'string' ? msg : 'İşlem başarısız.';
  }
}

