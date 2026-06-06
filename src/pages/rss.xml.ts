import { createRSS } from '../utils/rss';

type BlogPostFrontmatter = {
  title: string;
  description: string;
  date: string;
};

const posts: Array<{ slug: string; data: BlogPostFrontmatter }> = [
  {
    slug: 'my-journey-toward-becoming-a-soc-analyst',
    data: {
      title: 'My Journey Toward Becoming a SOC Analyst',
      description: 'A personal, realistic look at learning SOC workflows, building investigation habits, and turning alerts into evidence-based conclusions.',
      date: '2026-01-01'
    }
  },
  {
    slug: '5-common-security-mistakes-in-modern-web-applications',
    data: {
      title: '5 Common Security Mistakes in Modern Web Applications',
      description: 'Five realistic mistakes developers make—covering input handling, authentication, configuration, and safer-by-default practices.',
      date: '2026-01-15'
    }
  }
];

export async function GET() {
  const site = 'http://localhost:4321';


  const items = posts
    .sort((a, b) => b.data.date.localeCompare(a.data.date))
    .map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      url: `${site}/blog/${post.slug}`
    }));


  const rss = createRSS({
    title: 'Bal Reddy — Security Blog',
    description: 'Personal notes on SOC analysis and security operations.',
    items
  });

  return new Response(rss, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8'
    }
  });
}


