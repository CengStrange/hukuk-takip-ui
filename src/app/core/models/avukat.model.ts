export enum AvukatTipi {
    Sözleşmeli = 'Sözleşmeli',
    Kadrolu = 'Kadrolu',
    DışKaynak = 'DışKaynak'
}

export const AvukatTipiText: { [key in AvukatTipi]: string } = {
    [AvukatTipi.Sözleşmeli]: 'Sözleşmeli',
    [AvukatTipi.Kadrolu]: 'Kadrolu',
    [AvukatTipi.DışKaynak]: 'Dış Kaynak'
};

export interface AvukatListDto {
  id: string;
  adi: string;
  soyadi: string;
  tckn: string | null;
  avukatTipi: AvukatTipi | null;
  hesapAktifMi: boolean;
}
export interface Avukat {
    id: string;
    adi: string;
    soyadi: string;
    tckn?: string | null;
    vergiDairesi?: string | null;
    vergiNo?: string | null;
    email?: string | null;
    dogumTarihi?: string | null; 
    cepTelefonu?: string | null;
    isTelefonu?: string | null;
    isFaxNo?: string | null;
    sehirId?: number | null;
    ilceId?: number | null;
    tamAdres?: string | null;
    avansHesapSubeId?: number | null;
    avansHesapNo?: string | null;
    vadesizHesapSubeId?: number | null;
    vadesizHesapNo?: string | null;
    halkbankVadesizIbanNo?: string | null;
    digerBankaIbanNo?: string | null;
    avansLimiti: number;
    avukatTipi?: AvukatTipi | null;
    hesapAktifMi: boolean;
}
export interface SayfaSonucu<T> {
    totalCount: number;
    items: T[];
}

export type AvukatKayitDto = Omit<Avukat, 'id' | 'adSoyad'>;