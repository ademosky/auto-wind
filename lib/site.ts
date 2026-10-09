/**
 * Поставки за бизнисот — едно место за адреса и координати.
 *
 * Координатите се проверени (не се претпоставени):
 *   • Google Maps за „Довлеџик 100, Битола“ враќа 41.0344565, 21.3076047
 *     (место „Довлеџик“, Битола — place_id ChIJOSusanMlVxMRoKXdPp-pGDY)
 *   • OpenStreetMap (Nominatim и Photon) ја потврдуваат истата зона:
 *     41.0361, 21.3043 — разликата е центарот на зоната
 *
 * Ако треба попрецизна точка, се менуваат само latitude/longitude подолу.
 */

export const BUSINESS = {
  name: "AUTO WIND",
  addressShort: "Довлеџик 100, Битола",
  addressFull: "Довлеџик 100, Битола, Северна Македонија",
  /** Google Maps: место „Довлеџик“, Битола */
  latitude: 41.0344565,
  longitude: 21.3076047,
  zoom: 16,
} as const;

const query = encodeURIComponent(BUSINESS.addressFull);

/** Отвора пребарување на адресата во Google Maps. */
export const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${query}`;

/** Отвора навигација (насоки) до адресата во Google Maps. */
export const GOOGLE_DIRECTIONS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

/** За отворање од апликација на телефон. */
export const APPLE_MAPS_LINK = `https://maps.apple.com/?q=${encodeURIComponent(BUSINESS.addressFull)}`;

