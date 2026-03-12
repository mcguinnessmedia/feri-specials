import { z } from 'zod';
import { env } from './env';
import type { SpecialsApiResponse } from './types';

const specialsItemSchema = z.object({
  name: z.string(),
  price: z.string(),
  unlimited: z.boolean(),
  special: z.boolean(),
  locations: z.array(z.number().int().min(1)),
});

const specialsApiResponseSchema = z.object({
  lastUpdated: z.string(),
  marketOpen: z.boolean(),
  dateLabel: z.string(),
  footerLeft: z.string(),
  footerCenter: z.string(),
  fridge: z.array(specialsItemSchema),
  freezer: z.array(specialsItemSchema),
});

export async function fetchSpecials(): Promise<SpecialsApiResponse> {
  const response = await fetch(env.specialsApiUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch specials: ${response.status}`);
  }

  const json = await response.json();
  return specialsApiResponseSchema.parse(json);
}
