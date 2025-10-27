
export interface SayfaSonucu<T> {
  page: number;
  pageSize: number;
  total: number;
  items: T[];
}


export interface IcraDosyasiListItem {
  id: number;
  dosyaNo: string; 
  musteriAdi: string; 
  avukatAdi?: string; 
  icraMudurulugu?: string;
  takipTipi?: string;
  takipTarihi?: string; 
  durum: string; 
}

export interface IcraDosyasi {
  id: number;
  musteriId: string; 
  avukatId?: string | null; 
  avukatTevziNo?: string | null;
  takipTarihi?: string | null; 
  takipTipi?: string | null;
  ihtarlar?: string | null;
  ihtarBorclulari?: string | null;
  ihtarKonusuUrunler?: string | null;
  icraMudurulugu?: string | null;
  icraDosyaNo?: string | null; 
  mahiyetKodu?: string | null; 
  durum: number; 
  

  musteriAdi?: string;
  avukatAdi?: string;
}


export interface IcraDosyasiCreate {
  musteriId: string; 
  avukatId: string | null; 
  avukatTevziNo: string | null;
  takipTarihi: string; 
  takipTipi: string | null;
  ihtarlar: string | null;
  ihtarBorclulari: string | null;
  ihtarKonusuUrunler: string | null;
  icraMudurulugu: string | null;
  icraDosyaNo: string; 
  mahiyetKodu: string | null;
}

