import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UrunlerService} from '../../../services/urunler.service';
import { finalize } from 'rxjs'; 
import { UrunListDto, SayfaSonucu, UrunTipiText, } from '../../../core/models/urun.model';


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
    loading = signal(false); 
    
    public readonly Math = Math; 
    public urunTipiTextMap = UrunTipiText; 

    get toplamSayfa() {
        return Math.max(1, Math.ceil(this.data.totalCount / this.pageSize));
    }

    ngOnInit() {
        this.yenile(1);
    }

    yenile(page: number) {
        this.page = Math.max(1, page);
        const term = this.q?.trim() || null;
        
        this.loading.set(true); 
        
        this.srv.listele(term, this.page, this.pageSize).pipe(
            finalize(() => this.loading.set(false)) 
        ).subscribe({
            next: (res) => this.data = res,
            error: () => this.data = { totalCount: 0, items: [] } 
        });
    }

    temizle() {
        this.q = '';
        this.yenile(1);
    }

    sil(urun: UrunListDto) {
    
        const urunAdi = this.urunTipiTextMap[urun.urunTipi] || 'Bilinmeyen Ürün';
        if (!confirm(`"${urunAdi}" ürününü silmek istiyor musunuz?`)) return;
        
        this.silLoadingId.set(urun.id);
        
        this.srv.delete(urun.id).subscribe({
            next: () => {
                this.silLoadingId.set(null);
                this.yenile(this.page);
            },
            error: () => this.silLoadingId.set(null)
        });
    }


}
