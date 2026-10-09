/**
 * Поставки за бизнисот — едно место за адреса и координати.
 *
 * Координатите се точните од сопственикот (не се претпоставени):
 *   41°02'01.4"N 21°18'36.8"E  →  41.03370897, 21.30763908
 *   • преземени од официјалната локација на AUTO WIND во Google Maps
 *   • проверено со OpenStreetMap: точката паѓа на „11. Бригада,
 *     Довлеџик, Битола, Општина Битола, 7000“
 *
 * За промена на локацијата се менуваат само latitude/longitude подолу.
 */

export const BUSINESS = {
  name: "AUTO WIND",
  addressShort: "Довлеџик 100, Битола",
  addressFull: "Довлеџик 100, Битола, Северна Македонија",
  /** Точната локација на AUTO WIND (41°02'01.4"N 21°18'36.8"E) */
  latitude: 41.03370897,
  longitude: 21.30763908,
  zoom: 16,
} as const;

const query = encodeURIComponent(BUSINESS.addressFull);
const point = `${BUSINESS.latitude},${BUSINESS.longitude}`;

/** Отвора пребарување на адресата во Google Maps. */
export const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${point}`;

/** Отвора навигација (насоки) до адресата во Google Maps. */
export const GOOGLE_DIRECTIONS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${point}`;

/** За отворање од апликација на телефон. */
export const APPLE_MAPS_LINK = `https://maps.apple.com/?daddr=${point}&q=${encodeURIComponent(BUSINESS.name)}`;

