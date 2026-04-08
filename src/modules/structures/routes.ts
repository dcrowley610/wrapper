/**
 * Structures Module Routes
 * Currently a single page module; extensible for future multi-page workflows
 */

export const STRUCTURES_ROUTES = {
  HOME: '/',
  ENTITY_DETAIL: '/entity/:id',
  FUND: '/fund/:fundId',
} as const;

export type StructuresRouteKey = keyof typeof STRUCTURES_ROUTES;
