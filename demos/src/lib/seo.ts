import type { Address, Bnb } from '../data/types';

/** "06.16.70.36.20" or "+33 6 16 70 36 20" -> "+33616703620" (for tel: links and structured data). */
export function toE164FR(display: string): string {
  const digits = display.replace(/[^\d+]/g, '');
  const national = digits.startsWith('+33') ? `0${digits.slice(3)}` : digits;
  if (!/^0[1-9]\d{8}$/.test(national)) {
    throw new Error(`Not a French phone number: "${display}"`);
  }
  return `+33${national.slice(1)}`;
}

export function dmsToDecimal(deg: number, min: number, sec: number, hemi: 'N' | 'S' | 'E' | 'W'): number {
  if (min < 0 || min >= 60 || sec < 0 || sec >= 60) {
    throw new Error(`Invalid coordinate ${deg}°${min}'${sec}"`);
  }
  const value = deg + min / 60 + sec / 3600;
  return hemi === 'S' || hemi === 'W' ? -value : value;
}

/** Link that opens the address in the visitor's maps app; no embedded map, so no third-party tracking. */
export function mapsUrl(address: Address): string {
  const query = `${address.street}, ${address.postalCode} ${address.locality}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** schema.org BedAndBreakfast data so Google can show address, phone and map details for the business. */
export function buildLodgingJsonLd(bnb: Bnb, imageUrl: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BedAndBreakfast',
    name: bnb.name,
    url: bnb.url,
    image: imageUrl,
    telephone: toE164FR(bnb.phone),
    email: bnb.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: bnb.address.street,
      postalCode: bnb.address.postalCode,
      addressLocality: bnb.address.locality,
      addressCountry: 'FR',
    },
    ...(bnb.geo && { geo: { '@type': 'GeoCoordinates', ...bnb.geo } }),
    numberOfRooms: bnb.rooms.length,
    checkinTime: bnb.checkIn,
    checkoutTime: bnb.checkOut,
    ...(bnb.amenities.length > 0 && {
      amenityFeature: bnb.amenities.map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
    }),
  };
}
