import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div style="max-width:420px;margin:48px auto;padding:16px">
    <h2>Giriş Yap</h2>

    <form [formGroup]="frm" (ngSubmit)="onSubmit()" novalidate>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          class="form-control"
          type="email"
          formControlName="email"
          required
          autocomplete="username email"
          [class.is-invalid]="submitted && frm.controls.email.invalid"
        />
        <div class="invalid-feedback" *ngIf="submitted && frm.controls.email.errors">
          Lütfen geçerli bir e-posta girin.
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Şifre</label>
        <input
          class="form-control"
          type="password"
          formControlName="sifre"
          required
          autocomplete="current-password"
          [class.is-invalid]="submitted && frm.controls.sifre.invalid"
        />
        <div class="invalid-feedback" *ngIf="submitted && frm.controls.sifre.errors">
          Şifre zorunludur.
        </div>
      </div>

      <button
        class="btn btn-primary w-100"
        type="submit"
        [disabled]="frm.invalid || loading">
        {{ loading ? 'Gönderiliyor…' : 'Giriş' }}
      </button>

      <div class="text-danger mt-3" *ngIf="error">{{ error }}</div>
    </form>
  </div>
  `
})
export default class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  submitted = false;
  error = '';

  frm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    sifre: ['', [Validators.required]]
  });

  onSubmit() {
    this.submitted = true;
    if (this.frm.invalid || this.loading) return;

    this.loading = true;
    this.error = '';

    const dto = this.frm.value as LoginRequest;

    this.auth.login(dto).subscribe({
      next: _ => {
        // debug: payload/rol görmek istersen
        const raw = localStorage.getItem('auth_user');
        if (raw) console.log('auth_user', JSON.parse(raw));

        // guard tarafından gelmişse returnUrl’i kullan; yoksa müşterilere git
        const returnUrl =
          new URLSearchParams(location.search).get('returnUrl') || '/musteriler';

        this.router.navigateByUrl(returnUrl);
      },
      error: err => {
        // backend generic hata veya mesaj
        const msg =
          (typeof err?.error === 'string' && err.error) ||
          (err?.error?.message as string) ||
          'Email/şifre hatalı.';
        this.error = msg;
        this.loading = false;
      }
    });
  }
}
