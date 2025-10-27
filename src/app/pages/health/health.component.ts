import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HealthService } from '../../services/health.service';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './health.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HealthComponent implements OnInit {
  loading = true;

  ping: any = null;
  db: any = null;

  secureRes: any = null;
  adminRes: any = null;

  secureLoading = false;
  adminLoading = false;

  constructor(private hs: HealthService) {}

  ngOnInit(): void {
    // /api/health
    this.hs.ping().subscribe({
      next: r => (this.ping = r),
      error: _ => (this.ping = { ok: false, error: true })
    });

    // /api/health/db
    this.hs.db().subscribe({
      next: r => {
        this.db = r;
        this.loading = false;
      },
      error: _ => {
        this.db = { db: false, error: true };
        this.loading = false;
      }
    });
  }

  callSecure(): void {
    this.secureLoading = true;
    this.secureRes = null;
    this.hs.secure().subscribe({
      next: r => { this.secureRes = r; this.secureLoading = false; },
      error: e => { this.secureRes = e; this.secureLoading = false; }
    });
  }

  callAdmin(): void {
    this.adminLoading = true;
    this.adminRes = null;
    this.hs.adminOnly().subscribe({
      next: r => { this.adminRes = r; this.adminLoading = false; },
      error: e => { this.adminRes = e; this.adminLoading = false; }
    });
  }
}
