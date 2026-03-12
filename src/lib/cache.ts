import type { SpecialsApiResponse } from './types';

const CACHE_KEY = 'hope-market-specials';
export const CACHE_TTL_MS = 5 * 60 * 1000;

interface CachedSpecials {
  fetchedAt: number;
  data: SpecialsApiResponse;
}

function readCache(): CachedSpecials | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(CACHE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as CachedSpecials;

    if (!parsed?.data || typeof parsed?.fetchedAt !== 'number') {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getCachedSpecials(): SpecialsApiResponse | null {
  return readCache()?.data ?? null;
}

export function getCachedSpecialsIfFresh(): SpecialsApiResponse | null {
  const cached = readCache();
  if (!cached) return null;

  const age = Date.now() - cached.fetchedAt;
  return age <= CACHE_TTL_MS ? cached.data : null;
}

export function getCachedSpecialsAgeMs(): number | null {
  const cached = readCache();
  if (!cached) return null;

  return Date.now() - cached.fetchedAt;
}

export function setCachedSpecials(data: SpecialsApiResponse): void {
  if (typeof window === 'undefined') return;

  const payload: CachedSpecials = {
    fetchedAt: Date.now(),
    data,
  };

  window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
}

export function clearCachedSpecials(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CACHE_KEY);
}
