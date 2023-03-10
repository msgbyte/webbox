import urlRegex from 'url-regex';

/**
 * Check input is a valid url
 */
export function isValidUrl(url: string): boolean {
  return urlRegex({ exact: true }).test(url);
}
