export interface Sehir {
    id: number;
    ad: string;
}

export interface Sube {
    brmKod: number;
    brmAd: string;
}


export interface Ilce {
    id: number;
    ad: string;
}

export interface DavaTuru {
    id: number;
    ad: string;
}

export interface IcraDairesi {
    id: number;
    ad: string;
    sehirId: number;
    sehirAd: string;
}

