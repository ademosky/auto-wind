/**
 * Ги чита димензиите на слика без никаква надворешна библиотека.
 *
 * Ни требаат за да знаеме дали фотографијата е вертикална — вертикалните
 * се прикажуваат во целост (со замръчен фон), наместо да се сечат.
 *
 * Поддржано: JPEG, PNG, WebP (VP8/VP8L/VP8X) и AVIF (најдобро можно).
 * Ако форматот не е препознаен враќа null — тогаш третираме како хоризонтална.
 */

export type ImageDimensions = { width: number; height: number };

export function imageSize(buf: Buffer): ImageDimensions | null {
  try {
    if (buf.length < 24) return null;

    // PNG — IHDR е секогаш прв
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }

    // JPEG — најди го SOF сегментот
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let off = 2;
      while (off + 9 < buf.length) {
        if (buf[off] !== 0xff) {
          off += 1;
          continue;
        }
        const marker = buf[off + 1];
        // SOF0..SOF15, без DHT (c4), JPG (c8) и DAC (cc)
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return { height: buf.readUInt16BE(off + 5), width: buf.readUInt16BE(off + 7) };
        }
        const len = buf.readUInt16BE(off + 2);
        if (len < 2) return null;
        off += 2 + len;
      }
      return null;
    }

    // WebP — три варијанти
    if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
      const format = buf.toString("ascii", 12, 16);
      if (format === "VP8 ") {
        return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
      }
      if (format === "VP8L") {
        const bits = buf[21] | (buf[22] << 8) | (buf[23] << 16) | (buf[24] << 24);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
      if (format === "VP8X") {
        return {
          width: (buf[24] | (buf[25] << 8) | (buf[26] << 16)) + 1,
          height: (buf[27] | (buf[28] << 8) | (buf[29] << 16)) + 1,
        };
      }
      return null;
    }

    // AVIF — најдобро можно: барај ја ispe кутијата
    const ispe = buf.indexOf("ispe", 0, "ascii");
    if (ispe !== -1 && ispe + 20 <= buf.length) {
      return { width: buf.readUInt32BE(ispe + 8), height: buf.readUInt32BE(ispe + 12) };
    }

    return null;
  } catch {
    return null;
  }
}

/** Дали сликата е вертикална (повисока отколку што е широка). */
export function isPortrait(size: ImageDimensions | null | undefined): boolean {
  if (!size) return false;
  return size.height > size.width;
}

