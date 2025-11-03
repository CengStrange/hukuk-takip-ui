export enum UrunTipi {
    KrediKartiBorcu = 1,
    BireyselIhtiyacKredisi = 2,
    TasitKredisi = 3,
    KonutKredisi = 4,
    EkKartBorcu = 5,
    NakitAvansBorcu = 6,
    TaksitliAlisverisKredisi = 7,
    KrediliMevduatHesabi = 8,
    TicariKredi = 9,
    TicariKrediKarti = 10,
    LeasingBorcu = 11,
    FaktoringAlacagi = 12,
    KefaletBorcu = 13,
    SenetliAlacak = 14,
    CekliAlacak = 15
}

export const UrunTipiText: { [key in UrunTipi]: string } = {
    [UrunTipi.KrediKartiBorcu]: 'Kredi Kartı Borcu',
    [UrunTipi.BireyselIhtiyacKredisi]: 'Bireysel İhtiyaç Kredisi',
    [UrunTipi.TasitKredisi]: 'Taşıt Kredisi',
    [UrunTipi.KonutKredisi]: 'Konut Kredisi',
    [UrunTipi.EkKartBorcu]: 'Ek Kart Borcu',
    [UrunTipi.NakitAvansBorcu]: 'Nakit Avans Borcu',
    [UrunTipi.TaksitliAlisverisKredisi]: 'Taksitli Alışveriş Kredisi',
    [UrunTipi.KrediliMevduatHesabi]: 'Kredili Mevduat Hesabı (Eksi Bakiye)',
    [UrunTipi.TicariKredi]: 'Ticari Kredi (KOBİ Kredisi)',
    [UrunTipi.TicariKrediKarti]: 'Ticari Kredi Kartı',
    [UrunTipi.LeasingBorcu]: 'Leasing (Finansal Kiralama) Borcu',
    [UrunTipi.FaktoringAlacagi]: 'Faktoring Alacağı',
    [UrunTipi.KefaletBorcu]: 'Kefalet Borcu (Kefil Olduğu Kredi)',
    [UrunTipi.SenetliAlacak]: 'Senetli Alacak',
    [UrunTipi.CekliAlacak]: 'Çekli Alacak'
};

export interface UrunListDto {
    id: string;
    urunTipi: UrunTipi;
    musteriAdiUnvani: string;
    takipMiktari: number;
    dovizTipi: string;
    avukatAdiSoyadi: string | null;
}

export interface Urun extends UrunListDto {
    musteriId: string;
    avukatId?: string | null;
    krediBirimKoduSubeId?: number | null;
    takipBirimKoduSubeId?: number | null;
    takipTarihi: string; 
    aylikFaizOrani: number;
    faizBakiyesi: number;
    masrafBakiyesi: number;
    aciklama?: string | null;
    avukatAdiSoyadi: string | null;
    
    krediMudiNo?: string | null;
    masrafMudiNo?: string | null;
    faizMudiNo?: string | null;
    takipMudiNo?: string | null;
}

export interface UrunKayitDto {
    musteriId: string;
    avukatId?: string | null;
    urunTipi: UrunTipi;
    krediBirimKoduSubeId?: number | null;
    takipBirimKoduSubeId?: number | null;
    takipTarihi: string;
    takipMiktari: number;
    dovizTipi: string;
    aylikFaizOrani: number;
    faizBakiyesi: number;
    masrafBakiyesi: number;
    aciklama?: string | null;

    krediMudiNo?: string | null;
    masrafMudiNo?: string | null;
    faizMudiNo?: string | null;
    takipMudiNo?: string | null;
}

export type UrunUpdateDto = UrunKayitDto;

export interface SayfaSonucu<T> {
    totalCount: number;
    items: T[];
}
