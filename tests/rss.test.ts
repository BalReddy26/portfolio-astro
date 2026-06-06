import { describe, expect, it } from 'vitest';
import { createRSS } from '../src/utils/rss';
import { GET as rssGet } from '../src/pages/rss.xml';

describe('RSS utilities', () => {
  it('RSS generation includes required fields and valid XML structure', () => {
    const rss = createRSS({
      title: 'My RSS',
      description: 'Desc',
      items: [
        {
          title: 'Post 1',
          description: 'Hello',
          pubDate: '2026-01-01',
          url: 'http://example.com/post-1'
        }
      ]
    });

    expect(rss).toContain('<?xml version="1.0"');
    expect(rss).toContain('<rss version="2.0">');
    expect(rss).toContain('<channel>');
    expect(rss).toContain('<title>My RSS</title>');
    expect(rss).toContain('<description>Desc</description>');
    expect(rss).toContain('<item>');
    expect(rss).toContain('<title>Post 1</title>');
    expect(rss).toContain('<link>http://example.com/post-1</link>');
  });


  it('blog post inclusion: rss.xml GET includes both posts', async () => {
    const res = await rssGet();
    const text = await res.text();

    // Should include both hardcoded slugs/titles
    expect(text).toContain('My Journey Toward Becoming a SOC Analyst');
    expect(text).toContain('5 Common Security Mistakes in Modern Web Applications');
  });


  it('rss.xml output includes item entries', async () => {
    const res = await rssGet();
    const text = await res.text();
    const itemCount = (text.match(/<item>/g) || []).length;
    expect(itemCount).toBeGreaterThanOrEqual(2);
  });
});

