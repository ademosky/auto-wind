/**
 * Разбирање на YouTube линкови.
 *
 * Прифаќа ги сите облици што ги дава YouTube кога ќе кликнеш „Сподели“:
 *   https://www.youtube.com/watch?v=VIDEOID
 *   https://youtu.be/VIDEOID
 *   https://www.youtube.com/embed/VIDEOID
 *   https://www.youtube.com/shorts/VIDEOID
 *   https://www.youtube.com/live/VIDEOID
 *   (и кога линкот е само VIDEOID)
 *
 * Дополнителни параметри (t=, list=, si=) се игнорираат.
 */

export type YouTubeVideo = {
  id: string;
  /** Канонски линк за гледање / споделување */
  watchUrl: string;
  /** Основен линк за вградување (без параметри) — без колачиња */
  embedUrl: string;
  /** Насловна слика на видеото */
  thumbnailUrl: string;
};

const ID = "[A-Za-z0-9_-]{11}";

const PATTERNS: RegExp[] = [
  new RegExp(`youtube\\.com/watch\\?(?:[^#]*&)?v=(${ID})`),
  new RegExp(`youtu\\.be/(${ID})`),
  new RegExp(`youtube\\.com/embed/(${ID})`),
  new RegExp(`youtube\\.com/shorts/(${ID})`),
  new RegExp(`youtube\\.com/live/(${ID})`),
  new RegExp(`^(${ID})$`),
];

/** Враќа податоци за видеото или null ако линкот не е YouTube. */
export function parseYouTubeUrl(input: string | null | undefined): YouTubeVideo | null {
  if (!input) return null;
  const value = String(input).trim();
  if (!value) return null;

  for (const pattern of PATTERNS) {
    const match = value.match(pattern);
    if (match?.[1]) {
      const id = match[1];
      return {
        id,
        watchUrl: `https://www.youtube.com/watch?v=${id}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      };
    }
  }
  return null;
}

export function isYouTubeUrl(input: string | null | undefined): boolean {
  return parseYouTubeUrl(input) !== null;
}

/** Го враќа канонскиот линк, или null ако не е препознаен. */
export function canonicalYouTubeUrl(input: string | null | undefined): string | null {
  return parseYouTubeUrl(input)?.watchUrl ?? null;
}

