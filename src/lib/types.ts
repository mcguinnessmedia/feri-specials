export type Area = 'fridge' | 'freezer';

export interface SpecialsItem {
  name: string;
  price: string;
  unlimited: boolean;
  special: boolean;
  locations: number[];
}

export interface SpecialsApiResponse {
  lastUpdated: string;
  fridge: SpecialsItem[];
  freezer: SpecialsItem[];
}

export interface GroupedSpecialsSection {
  key: string;
  label: string;
  locations: number[];
  items: SpecialsItem[];
}

export interface GroupedSpecials {
  fridge: GroupedSpecialsSection[];
  freezer: GroupedSpecialsSection[];
}
