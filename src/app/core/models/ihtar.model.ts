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
  kimlikVerilisTarihi: string | null;
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

export interface PagedResult<T> {
  page: number;
  pageSize: number;
  total: number;
  totalCount: number;
  items: T[];
}

export interface IhtarListItemDto {
  id: number;
  musteriId: string;
  musteriAd: string;
  yevmiyeNo: string | null;
  ihtarTarihi: string;
  ihtarNo: string | null;
  ihtarnameNakitTutar: number;
  
  noterAdi: string | null;
  ihtarnameGayriNakitTutar: number;
}

export interface IhtarCreateDto {
  musteriId: string;
  musteriUrunleri: string | null;
  noterAdi: string | null;
  yevmiyeNo: string | null;
  ihtarTarihi: string;
  ihtarnameSuresiGun: number | null;
  tebligTarihi: string | null;
  ihtarTebligGirisTarihi: string | null;
  katTarihi: string | null;
  ihtarnameNakitTutar: number;
  ihtarnameGayriNakitTutar: number;
  ihtarNo: string | null;
}

export interface IhtarUpdateDto {
  musteriUrunleri: string | null;
  noterAdi: string | null;
  yevmiyeNo: string | null;
  ihtarTarihi: string;
  ihtarnameSuresiGun: number | null;
  tebligTarihi: string | null;
  ihtarTebligGirisTarihi: string | null;
  katTarihi: string | null;
  ihtarnameNakitTutar: number;
  ihtarnameGayriNakitTutar: number;
  ihtarNo: string | null;
}

export interface Ihtar {
  id: number;
  musteriId: string;
  musteri: Musteri;
  musteriUrunleri: string | null;
  noterAdi: string | null;
  yevmiyeNo: string | null;
  ihtarTarihi: string;
  ihtarnameSuresiGun: number | null;
  tebligTarihi: string | null;
  ihtarTebligGirisTarihi: string | null;
  katTarihi: string | null;
  ihtarnameNakitTutar: number;
  ihtarnameGayriNakitTutar: number;
  ihtarNo: string | null;
  olusturanUserId: number;
  olusturmaTarihiUtc: string;
}

export interface MusteriIhtarDto {
  id: number;
  ihtarNo: string | null;
  yevmiyeNo: string | null;
  ihtarTarihi: string;
  musteriUrunId: string | null;
}

