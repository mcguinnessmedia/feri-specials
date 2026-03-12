const apiUrl = import.meta.env.PUBLIC_SPECIALS_API_URL;

if (!apiUrl) {
  throw new Error('Missing PUBLIC_SPECIALS_API_URL');
}

export const env = {
  specialsApiUrl: apiUrl,
} as const;
