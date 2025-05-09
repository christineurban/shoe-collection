export interface StatItem {
  name: string;
  count: number;
  percentage: number;
}

export interface StatCount {
  name: string;
  count: number;
}

export interface CollectionStats {
  totalPolishes: number;
  totalBrands: number;
  totalColors: number;
  totalFinishes: number;
  averageRating: number;
  mostCommonBrand: StatCount;
  mostCommonColor: StatCount;
  mostCommonFinish: StatCount;
}
