import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UrunlerService, UrunListDto, SayfaSonucu, UrunTipi } from '../../../services/urunler.service';

@Component({
    standalone: true,
    selector: 'app-urun-list',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './urun-list.component.html'
})
export default class UrunListComponent implements OnInit {
    private srv = inject(UrunlerService);

    q = '';
    page = 1;
    pageSize = 10;

    data: SayfaSonucu<UrunListDto> = { totalCount: 0, items: [] };
    silLoadingId = signal<string | null>(null);

    get toplamSayfa() {
        return Math.max(1, Math.ceil(this.data.totalCount / this.pageSize));
    }

    ngOnInit() {
        this.yenile(1);
    }

    yenile(page: number) {
        this.page = Math.max(1, page);
        const term = this.q?.trim() || null;
        this.srv.listele(term, this.page, this.pageSize).subscribe(res => {
            this.data = res;
        });
    }

    temizle() {
        this.q = '';
        this.yenile(1);
    }

    sil(urun: UrunListDto) {
        if (!confirm(`"${this.getUrunTipiText(urun.urunTipi)}" ürününü silmek istiyor musunuz?`)) return;
        this.silLoadingId.set(urun.id);
        this.srv.delete(urun.id).subscribe({
            next: () => {
                this.silLoadingId.set(null);
                this.yenile(this.page);
            },
            error: () => this.silLoadingId.set(null)
        });
    }

    getUrunTipiText(urunTipi: UrunTipi): string {
        return UrunTipi[urunTipi]?.replace(/([A-Z])/g, ' $1').trim() ?? "Bilinmeyen";
    }
}
