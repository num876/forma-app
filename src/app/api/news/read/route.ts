import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import DOMPurify from 'isomorphic-dompurify';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing article ID' }, { status: 400 });
  }

  try {
    // Decode Base64URL string back to original URL
    const originalUrl = Buffer.from(id, 'base64url').toString('utf-8');

    // Fetch the raw HTML of the article with a browser-like User-Agent
    const response = await fetch(originalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      next: { revalidate: 3600 } // Cache scraped articles for an hour to avoid rate limits
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const html = await response.text();

    // Parse the HTML using JSDOM
    const doc = new JSDOM(html, { url: originalUrl });

    // Use Readability to extract the core article content
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article) {
      throw new Error('Readability failed to parse the article');
    }

    // Sanitize the extracted HTML to prevent XSS vulnerabilities
    const cleanHtml = DOMPurify.sanitize(article.content, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
      FORBID_ATTR: ['onerror', 'onload', 'onmouseover']
    });

    return NextResponse.json({
      title: article.title,
      byline: article.byline,
      siteName: article.siteName,
      excerpt: article.excerpt,
      content: cleanHtml,
      originalUrl: originalUrl
    });

  } catch (error) {
    console.error("Scraper Error:", error);
    // If the scraper fails (e.g. paywall/anti-bot), we return a 500 error 
    // so the frontend can display a fallback UI
    return NextResponse.json({ 
      error: 'Failed to extract article content. The source may have a strict paywall or anti-bot protection.',
      originalUrl: id ? Buffer.from(id, 'base64url').toString('utf-8') : null
    }, { status: 500 });
  }
}
