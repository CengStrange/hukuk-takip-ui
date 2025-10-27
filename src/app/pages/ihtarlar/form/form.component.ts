import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IhtarlarService } from '../../../services/ihtarlar.service';
import { IhtarCreateDto } from '../../../core/models/ihtar.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

type MusteriLite = { id: string; adiUnvani: string; musteriNo?: string };

@Component({
  standalone: true,
  selector: 'app-ihtar-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form.component.html',
})
export default class FormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(IhtarlarService);
  private http = inject(HttpClient);

  id = Number(this.route.snapshot.paramMap.get('id') || 0);
  kaydediliyor = signal<boolean>(false);
  musteriAramaSonuclari = signal<MusteriLite[]>([]);

  frm = this.fb.group({
    musteriId: ['', Validators.required],
    musteriUrunleri: [''],
    noterAdi: [''],
    yevmiyeNo: [''],
    ihtarTarihi: ['', Validators.required],
    ihtarnameSuresiGun: [null as number | null], // Formda type'ı netleştirelim
    tebligTarihi: [''],
    ihtarTebligGirisTarihi: [''],
    katTarihi: [''],
    ihtarnameNakitTutar: [0, [Validators.required, Validators.min(0)]],
    ihtarnameGayriNakitTutar: [0, [Validators.required, Validators.min(0)]],
    ihtarNo: [''],
    aciklama: [''],
  });

  /** DateOnly/ISO -> <input type="date"> uyumu */
  private toDateInput(v?: string | null): string {
    if (!v) return '';
    return v.length >= 10 ? v.substring(0, 10) : v; 
  }

  get duzenlemeMi() { return !!this.id; }

  ngOnInit() {
    if (this.duzenlemeMi) {
      this.api.getById(this.id).subscribe((dto) => {
        const val = {
          musteriId: dto.musteriId ?? '',
          musteriUrunleri: dto.musteriUrunleri ?? '',
          noterAdi: dto.noterAdi ?? '',
          yevmiyeNo: dto.yevmiyeNo ?? '',
          ihtarTarihi: this.toDateInput(dto.ihtarTarihi),
          ihtarnameSuresiGun: dto.ihtarnameSuresiGun ?? null,
          tebligTarihi: this.toDateInput(dto.tebligTarihi),
          ihtarTebligGirisTarihi: this.toDateInput(dto.ihtarTebligGirisTarihi),
          katTarihi: this.toDateInput(dto.katTarihi),
          ihtarnameNakitTutar: dto.ihtarnameNakitTutar ?? 0,
          ihtarnameGayriNakitTutar: dto.ihtarnameGayriNakitTutar ?? 0,
          ihtarNo: dto.ihtarNo ?? '',
          aciklama: dto.ihtarNo ?? '',
        } as const;

        this.frm.patchValue(val as any);
      });
    }
  }

  /**
   * Input olayını dinleyerek sadece sayısal değerlere izin verir.
   * HTML tarafında (input)="onInputNumbersOnly($event)" olarak kullanılır.
   */
  onInputNumbersOnly(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  onSubmit() {
    if (this.frm.invalid) {
      this.frm.markAllAsTouched();
      return;
    }
    this.kaydediliyor.set(true);

    const formValue = this.frm.getRawValue();

    // HATA DÜZELTME:
    // 1. `...formValue` spread'i kaldırıldı, çünkü opsiyonel alanlara ("") boş string gönderir.
    // 2. `ihtarnameSuresiGun` için "0" girildiğinde `null` gitme hatası düzeltildi.

    // DÜZELTME 2: (ihtarnameSuresiGun === '') kontrolü kaldırıldı, 
    // çünkü form tipi (number | null) zaten string'i engeller.
    const rawGun = formValue.ihtarnameSuresiGun;
    let suresiGunValue: number | null = null;
    
    if (rawGun === 0) {
        suresiGunValue = 0;
    } else if (!rawGun) { // Sadece null veya undefined kontrolü
        suresiGunValue = null;
    } else {
        suresiGunValue = Number(rawGun);
    }

    const payload: IhtarCreateDto = {
        musteriId: formValue.musteriId!,
        musteriUrunleri: formValue.musteriUrunleri || null,
        noterAdi: formValue.noterAdi || null,
        yevmiyeNo: (formValue.yevmiyeNo || '').replace(/\D/g, '') || null,
        
        // DÜZELTME 1: `|| null` kaldırıldı. Alan zorunlu olduğu için '!' (non-null) kullandık.
        ihtarTarihi: formValue.ihtarTarihi!, 
        
        ihtarnameSuresiGun: suresiGunValue,
        tebligTarihi: formValue.tebligTarihi || null,
        ihtarTebligGirisTarihi: formValue.ihtarTebligGirisTarihi || null,
        katTarihi: formValue.katTarihi || null,
        ihtarnameNakitTutar: formValue.ihtarnameNakitTutar ?? 0,
        ihtarnameGayriNakitTutar: formValue.ihtarnameGayriNakitTutar ?? 0,
        ihtarNo: (formValue.ihtarNo || '').replace(/\D/g, '') || null,
        aciklama: formValue.aciklama || null,
    };

    if (this.duzenlemeMi) {
      this.api.update(this.id, payload).subscribe({
        next: () => { this.kaydediliyor.set(false); this.router.navigate(['/ihtarlar']); },
        error: (e) => { this.kaydediliyor.set(false); alert('Kayıt sırasında hata: ' + (e?.error || e?.message || '')); }
      });
    } else {
      this.api.create(payload).subscribe({
        next: () => { this.kaydediliyor.set(false); this.router.navigate(['/ihtarlar']); },
        error: (e) => { this.kaydediliyor.set(false); alert('Kayıt sırasında hata: ' + (e?.error || e?.message || '')); }
      });
    }
  }

  araMusteri(q: string) {
    if (!q || q.trim().length < 2) {
      this.musteriAramaSonuclari.set([]);
      return;
    }
    const params = new HttpParams().set('q', q).set('page', 1).set('pageSize', 10);
    this.http.get<any>(`${environment.apiUrl}/Musteriler`, { params })
      .subscribe((res) => {
        const items = res?.items || res || [];
        const mapped: MusteriLite[] = items.map((x: any) => ({
          id: x.id,
          adiUnvani: x.adiUnvani || x.musteriNo,
          musteriNo: x.musteriNo,
        }));
        this.musteriAramaSonuclari.set(mapped);
      });
  }

  secMusteri(m: MusteriLite) {
    this.frm.patchValue({ musteriId: m.id });
    this.musteriAramaSonuclari.set([]);
  }
}

