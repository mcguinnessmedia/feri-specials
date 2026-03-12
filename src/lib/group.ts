import type {
  GroupedSpecials,
  GroupedSpecialsSection,
  SpecialsApiResponse,
  SpecialsItem,
  Area,
} from './types';
import { formatSectionLabel } from './format';

function normalizeLocations(locations: number[]): number[] {
  return [...new Set(locations)].sort((a, b) => a - b);
}

function makeLocationKey(locations: number[]): string {
  return normalizeLocations(locations).join('-');
}

function groupAreaItems(
  area: Area,
  items: SpecialsItem[],
): GroupedSpecialsSection[] {
  const groups = new Map<string, GroupedSpecialsSection>();

  for (const item of items) {
    const locations = normalizeLocations(item.locations);
    const key = makeLocationKey(locations);

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: formatSectionLabel(area, locations),
        locations,
        items: [],
      });
    }

    const group = groups.get(key);
    if (group) {
      group.items.push(item);
    }
  }

  return [...groups.values()].sort((a, b) => {
    const aFirst = a.locations[0] ?? 999;
    const bFirst = b.locations[0] ?? 999;
    return aFirst - bFirst;
  });
}

export function groupSpecials(data: SpecialsApiResponse): GroupedSpecials {
  return {
    fridge: groupAreaItems('fridge', data.fridge),
    freezer: groupAreaItems('freezer', data.freezer),
  };
}
