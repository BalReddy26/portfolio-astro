type RssItem = {
  title: string;
  description?: string;
  pubDate: string;
  url: string;
};

export function createRSS(options: {
  title: string;
  description: string;
  items: RssItem[];
}) {
  const { title, description, items } = options;

  const xmlItems = items
    .map((item) => {
      const desc = item.description ? `<description><![CDATA[${item.description}]]></description>` : '<description></description>';
      return `  <item>\n    <title>${escapeXml(item.title)}</title>\n    ${desc}\n    <link>${escapeXml(item.url)}</link>\n    <guid>${escapeXml(item.url)}</guid>\n    <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>\n  </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>${escapeXml(title)}</title>\n  <description>${escapeXml(description)}</description>\n  <link>${''}</link>\n${xmlItems}\n</channel>\n</rss>`;
}

function escapeXml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&apos;');
}

