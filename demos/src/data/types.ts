import type { ImageMetadata } from 'astro';

export interface Photo {
  src: ImageMetadata;
  alt: string;
}

export interface Room {
  name: string;
  /** One line a guest scans: bed, size, view. */
  summary: string;
  photos: Photo[];
}

export interface PriceRow {
  label: string;
  /** Prices as published on the current site, already formatted (e.g. "115 à 125 €"). */
  values: string[];
}

export interface PriceTable {
  title: string;
  columns: string[];
  rows: PriceRow[];
  notes: string[];
}

export interface Address {
  street: string;
  postalCode: string;
  locality: string;
}

export interface Geo {
  latitude: number;
  longitude: number;
}

/** A thing the place is loved for (spa, pool, family table...), told in the owners' own words. */
export interface Highlight {
  title: string;
  text: string;
  photos: Photo[];
}

export interface Bnb {
  slug: string;
  name: string;
  /** Short tagline built from the owners' own wording on their current site. */
  tagline: string;
  intro: string;
  /** Best candidates for the opening banner, strongest first. */
  heroPhotos: Photo[];
  highlights: Highlight[];
  gallery: Photo[];
  /** Opening season, minimum stays, parking... */
  practical: string[];
  /** Live domain the rebuilt site would replace; used for canonical URL and structured data. */
  url: string;
  hosts: string;
  /** French display format, e.g. "06 16 70 36 20". */
  phone: string;
  email: string;
  address: Address;
  geo?: Geo;
  google: { rating: number; reviews: number };
  labels: string[];
  seo: { title: string; description: string };
  amenities: string[];
  checkIn: string;
  checkOut: string;
  rooms: Room[];
  prices: PriceTable[];
  bookingTerms: string[];
  directions: { from: string; steps: string }[];
}
