import { Rating } from './rating';

export interface NailPolish {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  color: string;
  finishes: string[];
  rating: Rating | null;
  link: string | null;
}
