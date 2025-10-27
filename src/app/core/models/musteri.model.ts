export enum BorcluTipi { GercekKisi = 1, TuzelKisi = 2 }

export type MusteriListDto = {
  id: string;
  musteriNo: string;
  adiUnvani?: string | null;
  borcluTipi: number; 
};

export type MusteriDetailDto = {
  id: string;
  musteriNo: string;
  adiUnvani?: string | null;
  borcluTipi: number; 
};

export type MusteriCreateDto = {
  musteriNo: string;
  adiUnvani?: string | null;
  borcluTipi: number; 
};

export type MusteriUpdateDto = {
  musteriNo: string;
  adiUnvani?: string | null;
  borcluTipi: number; 
};

export type SayfaSonucu<T> = {
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};
