import { nail_polish, Rating } from '@prisma/client';

export interface Polish {
  id: string;
  name: string;
  brand: string;
  link?: string | null;
  imageUrl: string | null;
  colors: string[];
  finishes: string[];
  rating: Rating | null;
  coats: number | null;
  notes: string | null;
  lastUsed: Date | null;
  totalBottles: number | null;
  emptyBottles: number | null;
  isOld: boolean | null;
}

export interface NailPolishWithRelations extends nail_polish {
  brands: {
    name: string;
  };
  colors: {
    color: {
      name: string;
    };
  }[];
  finishes: {
    finish: {
      name: string;
    };
  }[];
}
