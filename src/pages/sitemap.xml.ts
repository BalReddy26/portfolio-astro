const postSlugs = [
  'my-journey-toward-becoming-a-soc-analyst',
  '5-common-security-mistakes-in-modern-web-applications'
];

export async function GET() {
  const site = import.meta.env.SITE_URL || 'http://localhost:4321';



  const urls = [
    { loc: `${site}/` },
    { loc: `${site}/about` },
    { loc: `${site}/projects` },
    { loc: `${site}/blog` },
    ...postSlugs.map((slug) => ({ loc: `${site}/blog/${slug}` })),
    { loc: `${site}/contact` }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n  </url>`)
    .join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8'
    }
  });
}

