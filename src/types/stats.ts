export interface StatItem {
  name: string;
  count: number;
  percentage: number;
}

export interface StatCount {
  name: string;
  count: number;
}

interface CommonStat {
  name: string;
  count: number;
}

export interface Stats {
  totalShoes: number;
  totalBrands: number;
  totalColors: number;
  totalDressStyles: number;
  totalShoeTypes: number;
  totalHeelTypes: number;
  totalLocations: number;
  mostCommonBrand: CommonStat;
  mostCommonColor: CommonStat;
  mostCommonDressStyle: CommonStat;
  mostCommonShoeType: CommonStat;
  mostCommonHeelType: CommonStat;
  mostCommonLocation: CommonStat;
}
