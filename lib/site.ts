/**
 * Поставки за бизнисот — едно место за адреса, координати и линкови.
 *
 * Локацијата е земена од официјалниот линк на AUTO WIND во Google Maps
 * (maps.app.goo.gl/nRruK5HE2cRGDQb27):
 *
 *   https://www.google.com/maps/place/…/@41.033709,21.3076391,17z/
 *      data=!…!3d41.033709!4d21.310214
 *
 * ВАЖНО: во ваквите Google линкови има две точки — `@lat,lng` е само центарот
 * на приказот, а `!3d`/`!4d` е ВИСТИНСКАТА локација на местото. Се користи второто:
 *   41.033709, 21.310214   (41°02'01.4"N 21°18'36.8"E)
 */

export const BUSINESS = {
  name: "AUTO WIND",
  addressShort: "Довлеџик 100, Битола",
  addressFull: "Довлеџик 100, Битола, Северна Македонија",
  /** Вистинската локација на местото (41°02'01.4"N 21°18'36.8"E) */
  latitude: 41.033709,
  longitude: 21.310214,
} as const;

const query = encodeURIComponent(BUSINESS.addressFull);
const point = `${BUSINESS.latitude},${BUSINESS.longitude}`;

/**
 * Официјалниот вграден код (iframe) од Google Maps за оваа локација.
 * Не бара API клуч — преземен е од „Сподели → Вгради карта“ на местото.
 *
 * Не се менува рачно: овде 2d/3d е центарот на приказот, а точната позиција
 * на иглата ја црта Google од вградениот податок во pb параметарот.
 */
export const GOOGLE_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3009.6135951075657!2d21.30763907558751!3d41.03370897134704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDAyJzAxLjQiTiAyMcKwMTgnMzYuOCJF!5e0!3m2!1sen!2smk!4v1791586527338!5m2!1sen!2smk";

/** Отвора ја точната локација во Google Maps. */
export const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${point}`;

/** Отвора навигација (насоки) до точната локација. */
export const GOOGLE_DIRECTIONS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${point}`;

/** Оригиналниот линк на сопственикот (резервна опција и за споделување). */
export const GOOGLE_PLACE_SHORT_LINK = "https://maps.app.goo.gl/nRruK5HE2cRGDQb27";

/** За отворање од Apple Maps на iPhone. */
export const APPLE_MAPS_LINK = `https://maps.apple.com/?daddr=${point}&q=${encodeURIComponent(BUSINESS.name)}`;

