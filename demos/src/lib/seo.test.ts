import { describe, expect, it } from 'vitest';
import { buildLodgingJsonLd, dmsToDecimal, mapsUrl, toE164FR } from './seo';
import type { Bnb } from '../data/types';

const img = (src: string) => ({ src, width: 800, height: 533, format: 'jpg' as const });

const base: Bnb = {
  slug: 'demo',
  name: 'Les Falaises',
  tagline: '',
  intro: '',
  heroPhotos: [],
  highlights: [],
  gallery: [],
  practical: [],
  url: 'https://www.lesfalaises.fr/',
  hosts: 'Brigitte et Patrick Marchetti',
  phone: '06 16 70 36 20',
  email: 'hote@example.fr',
  address: { street: "Calade de l'École, Liaucous", postalCode: '12720', locality: 'Mostuéjouls' },
  geo: { latitude: 44.2025, longitude: 3.195 },
  google: { rating: 5, reviews: 46 },
  labels: [],
  seo: { title: 't', description: 'd' },
  amenities: ['Spa', 'Wifi'],
  checkIn: '12:00',
  checkOut: '11:00',
  rooms: [
    { name: 'A', summary: '', photos: [{ src: img('/a.jpg'), alt: '' }] },
    { name: 'B', summary: '', photos: [] },
  ],
  prices: [],
  bookingTerms: [],
  directions: [],
};

describe('toE164FR', () => {
  it('converts dotted and spaced French numbers', () => {
    expect(toE164FR('06.16.70.36.20')).toBe('+33616703620');
    expect(toE164FR('05 65 59 85 78')).toBe('+33565598578');
  });

  it('accepts a number already in +33 form', () => {
    expect(toE164FR('+33 6 16 70 36 20')).toBe('+33616703620');
  });

  it('rejects numbers that are not 10 French digits', () => {
    expect(() => toE164FR('06 16 70 36')).toThrow();
    expect(() => toE164FR('')).toThrow();
    expect(() => toE164FR('16 16 70 36 20')).toThrow();
  });
});

describe('dmsToDecimal', () => {
  it('converts north/east to positive decimals', () => {
    expect(dmsToDecimal(44, 12, 9, 'N')).toBeCloseTo(44.2025, 4);
    expect(dmsToDecimal(3, 11, 42, 'E')).toBeCloseTo(3.195, 4);
  });

  it('makes south/west negative', () => {
    expect(dmsToDecimal(3, 11, 42, 'W')).toBeCloseTo(-3.195, 4);
    expect(dmsToDecimal(0, 30, 0, 'S')).toBeCloseTo(-0.5, 4);
  });

  it('rejects out-of-range minutes or seconds', () => {
    expect(() => dmsToDecimal(44, 60, 0, 'N')).toThrow();
    expect(() => dmsToDecimal(44, 0, 60, 'N')).toThrow();
  });
});

describe('mapsUrl', () => {
  it('builds an encoded Google Maps search link from the address', () => {
    expect(mapsUrl(base.address)).toBe(
      "https://www.google.com/maps/search/?api=1&query=Calade%20de%20l'%C3%89cole%2C%20Liaucous%2C%2012720%20Mostu%C3%A9jouls",
    );
  });
});

describe('buildLodgingJsonLd', () => {
  it('describes the business as a BedAndBreakfast with contact and address', () => {
    const ld = buildLodgingJsonLd(base, 'https://www.lesfalaises.fr/og.jpg');
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('BedAndBreakfast');
    expect(ld.name).toBe('Les Falaises');
    expect(ld.telephone).toBe('+33616703620');
    expect(ld.email).toBe('hote@example.fr');
    expect(ld.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: "Calade de l'École, Liaucous",
      postalCode: '12720',
      addressLocality: 'Mostuéjouls',
      addressCountry: 'FR',
    });
    expect(ld.image).toBe('https://www.lesfalaises.fr/og.jpg');
    expect(ld.numberOfRooms).toBe(2);
    expect(ld.checkinTime).toBe('12:00');
    expect(ld.checkoutTime).toBe('11:00');
  });

  it('lists amenities as LocationFeatureSpecification entries', () => {
    const ld = buildLodgingJsonLd(base, 'x');
    expect(ld.amenityFeature).toEqual([
      { '@type': 'LocationFeatureSpecification', name: 'Spa', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Wifi', value: true },
    ]);
  });

  it('includes geo only when coordinates are known', () => {
    expect(buildLodgingJsonLd(base, 'x').geo).toEqual({ '@type': 'GeoCoordinates', latitude: 44.2025, longitude: 3.195 });
    const { geo: _geo, ...noGeo } = base;
    expect(buildLodgingJsonLd(noGeo, 'x')).not.toHaveProperty('geo');
  });

  it('never self-declares review ratings (Google ignores self-serving review markup)', () => {
    expect(buildLodgingJsonLd(base, 'x')).not.toHaveProperty('aggregateRating');
  });

  it('omits amenityFeature when there are none', () => {
    expect(buildLodgingJsonLd({ ...base, amenities: [] }, 'x')).not.toHaveProperty('amenityFeature');
  });
});
