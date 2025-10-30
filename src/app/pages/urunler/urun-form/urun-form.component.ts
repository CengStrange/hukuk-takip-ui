import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, switchMap, finalize, map, Observable } from 'rxjs';
import { UrunlerService, UrunTipi, UrunKayitDto, UrunTipiText } from '../../../services/urunler.service';
import { SozlukService } from '../../../services/sozluk.service';
import { MusterilerService, MusteriListDto } from '../../../services/musteriler.service';
import { AvukatlarService, AvukatListDto } from '../../../services/avukatlar.service';

@Component({
  standalone: true,
  selector: 'app-urun-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './urun-form.component.html'
})
export default class UrunFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private srv = inject(UrunlerService);
  private sozlukSrv = inject(SozlukService);
  private musteriSrv = inject(MusterilerService);
  private avukatSrv = inject(AvukatlarService);

  kaydediliyor = signal(false);
  duzenlemeMi = false;
  submitted = false;
  private id: string | null = null;
  urunTipleri = Object.entries(UrunTipiText);
  subeler$ = this.sozlukSrv.subeler();

  musteriAramaSonuclari = signal<MusteriListDto[]>([]);
  avukatAramaSonuclari = signal<AvukatListDto[]>([]);
  secilenMusteri = signal<MusteriListDto | null>(null);
  secilenAvukat = signal<AvukatListDto | null>(null);

  frm = this.fb.group({
    musteriId: [null as string | null, [Validators.required]],
    avukatId: [null as string | null],
    musteriArama: [''],
    avukatArama: [''],
    urunTipi: [null as UrunTipi | null, [Validators.required]],
    krediBirimKoduSubeId: [null as number | null],
    takipBirimKoduSubeId: [null as number | null],
    takipTarihi: ['', [Validators.required]],
    takipMiktari: [0, [Validators.required, Validators.min(0.01)]],
    dovizTipi: ['TL', [Validators.required]],
    aylikFaizOrani: [0, [Validators.required, Validators.min(0)]],
    faizBakiyesi: [0, [Validators.required, Validators.min(0)]],
    masrafBakiyesi: [0, [Validators.required, Validators.min(0)]],
    aciklama: [''],
    krediMudiNo: [null as string | null, [Validators.maxLength(50)]],
    masrafMudiNo: [null as string | null, [Validators.maxLength(50)]],
    faizMudiNo: [null as string | null, [Validators.maxLength(50)]],
    takipMudiNo: [null as string | null, [Validators.maxLength(50)]],
  });

  constructor() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.duzenlemeMi = !!this.id;

    if (this.duzenlemeMi) {
      this.kaydediliyor.set(true);
      this.srv.getir(this.id!).pipe(finalize(() => this.kaydediliyor.set(false))).subscribe(urun => {
        this.frm.patchValue({ ...urun });
        this.secilenMusteri.set({ id: urun.musteriId, adiUnvani: urun.musteriAdiUnvani } as MusteriListDto);
      });
    }

    this.frm.controls.musteriArama.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => !!term && term.length >= 2),
      switchMap(term => this.musteriSrv.listele(term, 1, 10))
    ).subscribe(res => this.musteriAramaSonuclari.set(res.items));

    this.frm.controls.avukatArama.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => !!term && term.length >= 2),
      switchMap(term => this.avukatSrv.listele(term, 1, 10))
    ).subscribe(res => this.avukatAramaSonuclari.set(res.items));
  }


  onInputNumbersOnly(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  secMusteri(m: MusteriListDto) {
    this.frm.controls.musteriId.setValue(m.id);
    this.secilenMusteri.set(m);
    this.frm.controls.musteriArama.setValue(m.adiUnvani, { emitEvent: false });
    this.musteriAramaSonuclari.set([]);
  }

  secAvukat(a: AvukatListDto) {
    this.frm.controls.avukatId.setValue(a.id);
    this.secilenAvukat.set(a);
    this.frm.controls.avukatArama.setValue(`${a.adi} ${a.soyadi}`, { emitEvent: false });
    this.avukatAramaSonuclari.set([]);
  }

  onSubmit() {
    this.submitted = true;
    if (this.frm.invalid || this.kaydediliyor()) return;

    this.kaydediliyor.set(true);
    const formValue = this.frm.getRawValue();

    const payload: UrunKayitDto = {
      musteriId: formValue.musteriId!,
      avukatId: formValue.avukatId || null,
      urunTipi: formValue.urunTipi!,
      krediBirimKoduSubeId: formValue.krediBirimKoduSubeId || null,
      takipBirimKoduSubeId: formValue.takipBirimKoduSubeId || null,
      takipTarihi: formValue.takipTarihi!,
      takipMiktari: formValue.takipMiktari!,
      dovizTipi: formValue.dovizTipi!,
      aylikFaizOrani: formValue.aylikFaizOrani!,
      faizBakiyesi: formValue.faizBakiyesi!,
      masrafBakiyesi: formValue.masrafBakiyesi!,
      aciklama: formValue.aciklama || null,
      krediMudiNo: (formValue.krediMudiNo || '').replace(/\D/g, '') || null,
      masrafMudiNo: (formValue.masrafMudiNo || '').replace(/\D/g, '') || null,
      faizMudiNo: (formValue.faizMudiNo || '').replace(/\D/g, '') || null,
      takipMudiNo: (formValue.takipMudiNo || '').replace(/\D/g, '') || null,
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
      next: () => this.router.navigate(['/urunler']),
      error: (err) => alert(err?.error?.message || 'Bir hata oluştu.')
    });
  }
}
