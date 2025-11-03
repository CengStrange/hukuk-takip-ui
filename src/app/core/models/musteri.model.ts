export enum Cinsiyet { Erkek = 1, Kadin = 2 }
export enum MedeniDurum { Bekar = 1, Evli = 2 }
export enum BorcluTipi {
  AsilKrediBorclusu = 1,
  Kefil = 2,
  Mirasci = 3,
  Ciranta = 4,
  Kesideci = 5
}
export enum MusteriTuru { Bireysel = 1, Kurumsal = 2 }

export interface MusteriListDto {
  id: string; 
  musteriNo: string;
  adiUnvani: string | null;
  borcluTipi: BorcluTipi;
  borcluSoyadi: string | null;
  tckn: string | null;
}

export interface Musteri {
  id?: string; 
  musteriNo: string;
  adiUnvani: string | null;
  borcluTipi: BorcluTipi;
  borcluSoyadi: string | null;
  tckn: string | null;
  dogumTarihi: string | null; 
  dogumYeri: string | null;
  cinsiyet: Cinsiyet | null;
  medeniDurum: MedeniDurum | null;
  babaAdi: string | null;
  anneAdi: string | null;
  pasaportNumarasi: string | null;
  kimlikVerilisTarihi: string | null; // "YYYY-MM-DD"
  nufusaKayitliOlduguIl: string | null;
  ciltNo: string | null;
  aileSiraNo: string | null;
  kutukSiraNo: string | null;
  surucuBelgesiNumarasi: string | null;
  sehirId: number | null;
  ilceId: number | null;
  semt: string | null;
  vergiDairesi: string | null;
  vergiNo: string | null;
  sskNo: string | null;
  sskIsyeriNumarasi: string | null;
  ticaretSicilNo: string | null;
  borcuTipi: string | null;
  musteriMusteriTipi: MusteriTuru;
  hayattaMi: boolean;
}

export interface SayfaSonucu<T> {
  totalCount: number;
  items: T[];
}
