import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'

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
        const raw = localStorage.getItem('auth_user');
        if (raw) console.log('auth_user', JSON.parse(raw));


        const returnUrl =
          new URLSearchParams(location.search).get('returnUrl') || '/home'; // '/musteriler' yerine '/home'

        this.router.navigateByUrl(returnUrl);
      },
      error: err => {

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
