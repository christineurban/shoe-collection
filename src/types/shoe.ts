import { shoes } from '@prisma/client';

export interface Shoe {
  id: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  colors: string[];
  dressStyle: string;
  shoeType: string;
  heelType: string;
  location: string;
  notes: string | null;
}

export interface ShoeWithRelations extends Omit<shoes, 'brand_id' | 'location_id' | 'shoe_type_id' | 'heel_type_id' | 'dress_style_id'> {
  brand: {
    name: string;
  };
  colors: Array<{
    color: {
      name: string;
    };
  }>;
  dress_style: {
    name: string;
  };
  shoe_type: {
    name: string;
  };
  heel_type: {
    name: string;
  };
  location: {
    name: string;
  };
}
