export function formatUpdatedTime(value: string): string {
  const date = new Date(value);

  return date.toLocaleTimeString([], {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatLocationNumbers(locations: number[]): string {
  if (locations.length === 0) return '';
  if (locations.length === 1) return `${locations[0]}`;
  if (locations.length === 2) return `${locations[0]} & ${locations[1]}`;

  return `${locations.slice(0, -1).join(', ')} & ${locations.at(-1)}`;
}

export function formatSectionLabel(
  area: 'fridge' | 'freezer',
  locations: number[],
): string {
  const prefix = area === 'fridge' ? 'Fridge' : 'Freezer';
  return `${prefix} ${formatLocationNumbers(locations)}`;
}
