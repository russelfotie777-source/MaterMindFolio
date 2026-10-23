import type { MetadataRoute } from 'next';

import { SLUGS } from '@/lib/faits/projets';
import { SITE_URL } from '@/lib/site';

const ROUTES = [
  '/',
  '/visite',
  '/projets',
  '/parcours',
  '/resume-recruteur',
  '/contact',
  '/fabrication',
  '/mentions',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...ROUTES, ...SLUGS.map((slug) => `/projets/${slug}`)].map((route) => ({
    url: new URL(route, SITE_URL).href,
  }));
}
