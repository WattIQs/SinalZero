export type Lead = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address: string;
  category: string;
  website?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  rating?: number;
  signals: number;
};

export type SearchPlace = { display_name: string; lat: number; lon: number; boundingbox?: string[] };
