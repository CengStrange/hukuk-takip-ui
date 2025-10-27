export interface IhtarListItemDto {
  id: number;
  musteriId: string;
  musteriAd: string;
  noterAdi?: string | null;
  yevmiyeNo?: string | null;
  ihtarTarihi: string; // ISO (yyyy-MM-dd veya yyyy-MM-ddTHH:mm:ss)
  ihtarNo?: string | null;
  ihtarnameNakitTutar: number;
  ihtarnameGayriNakitTutar: number;
  // UI türevi alanlar (opsiyonel)
  sonOdemeTarihi?: string | null;
}

export interface IhtarCreateDto {
  musteriId: string;
  musteriUrunleri?: string | null;
  noterAdi?: string | null;
  yevmiyeNo?: string | null;
  ihtarTarihi: string; // yyyy-MM-dd
  ihtarnameSuresiGun?: number | null;
  tebligTarihi?: string | null;
  ihtarTebligGirisTarihi?: string | null;
  katTarihi?: string | null;
  ihtarnameNakitTutar: number;
  ihtarnameGayriNakitTutar: number;
  ihtarNo?: string | null;
  aciklama?: string | null;
}

export interface IhtarUpdateDto extends Partial<IhtarCreateDto> {}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
