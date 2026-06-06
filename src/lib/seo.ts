export type OgImage = {
  url: string;
  width?: number;
  height?: number;
};

export type SeoFields = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: OgImage | string;
  ogType?: string;
};

export function normalizeOgImage(image: OgImage | string | undefined): string | undefined {
  if (!image) return undefined;
  if (typeof image === 'string') return image;
  return image.url;
}

