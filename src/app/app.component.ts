import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  // STYLES GÜNCELLENDİ: Layout + Halkbank Navbar stilleri
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .navbar-nav .nav-link.active,
    .navbar-nav .nav-link:hover {
      background-color: #003D7C;
      color: #ffffff !important;
      border-radius: 0.375rem;
    }
    .navbar-nav .nav-link {
      color: #212529;
      font-weight: 500;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .navbar-brand {
      color: #003D7C !important;
      font-weight: 700;
    }
    .btn-danger {
      --bs-btn-bg: #E11A24;
      --bs-btn-border-color: #E11A24;
      --bs-btn-hover-bg: #c91820;
      --bs-btn-hover-border-color: #c91820;
    }
  `]
})
export class AppComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  // Bu değişken login ekranında navbar'ı gizler
  showNav = false;

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // 'showNav' state'i login ekranında false, diğerlerinde true olur.
      this.showNav = event.urlAfterRedirects !== '/login';
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

