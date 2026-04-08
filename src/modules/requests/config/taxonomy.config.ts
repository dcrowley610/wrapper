import type { TaxonomyPath } from '../types';

/** Available domain labels. */
export const DOMAIN_OPTIONS: string[] = ['Tax Compliance'];

export function addDomain(name: string): void {
  if (!DOMAIN_OPTIONS.includes(name)) DOMAIN_OPTIONS.push(name);
}

export function renameDomain(oldName: string, newName: string): void {
  const idx = DOMAIN_OPTIONS.indexOf(oldName);
  if (idx !== -1) DOMAIN_OPTIONS[idx] = newName;
}

/** Format a TaxonomyPath as a breadcrumb string. */
export function formatTaxonomyBreadcrumb(path: TaxonomyPath): string {
  return [path.domain, path.category].filter(Boolean).join(' > ');
}
