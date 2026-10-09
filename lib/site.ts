/**
 * Поставки за бизнисот — едно место за адреса, координати и линкови.
 *
 * Координатите се точните од сопственикот (не се претпоставени):
 *   41°02'01.4"N 21°18'36.8"E  →  41.03370897, 21.30763908
 *   • преземени од официјалната локација на AUTO WIND во Google Maps
 *   • проверено со OpenStreetMap: точката паѓа на „11. Бригада, Довлеџик, Битола“
 *
 * За промена на локацијата се менуваат само latitude/longitude и испраќачот на картата.
 */

export const BUSINESS = {
  name: "AUTO WIND",
  addressShort: "Довлеџик 100, Битола",
  addressFull: "Довлеџик 100, Битола, Северна Македонија",
  /** Точната локација на AUTO WIND (41°02'01.4"N 21°18'36.8"E) */
  latitude: 41.03370897,
  longitude: 21.30763908,
} as const;

const query = encodeURIComponent(BUSINESS.addressFull);
const point = `${BUSINESS.latitude},${BUSINESS.longitude}`;

/**
 * Официјалниот вграден код (iframe) од Google Maps за оваа локација.
 * Не бара API клуч и не се менува рачно — преземен е од „Сподели → Вгради карта“
 * на локацијата AUTO WIND.
 */
export const GOOGLE_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3009.6135951075657!2d21.30763907558751!3d41.03370897134704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDAyJzAxLjQiTiAyMcKwMTgnMzYuOCJF!5e0!3m2!1sen!2smk!4v1791584858716!5m2!1sen!2smk";

/** Отвора ја локацијата во Google Maps (нова страница). */
export const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${point}`;

/** Отвора навигација (насоки) до локацијата во Google Maps. */
export const GOOGLE_DIRECTIONS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${point}`;

/** За отворање од Apple Maps на iPhone. */
export const APPLE_MAPS_LINK = `https://maps.apple.com/?daddr=${point}&q=${encodeURIComponent(BUSINESS.name)}`;

