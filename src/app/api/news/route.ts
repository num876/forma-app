import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export async function GET() {
  try {
    const parser = new Parser({
      customFields: {
        item: [
          ['enclosure', 'enclosure'],
          ['media:content', 'mediaContent']
        ]
      }
    });
    
    // Aggregating multiple reliable sources that don't block scraping
    const feeds = await Promise.allSettled([
      parser.parseURL('https://talksport.com/football/feed/'), // TalkSport
      parser.parseURL('https://feeds.bbci.co.uk/sport/football/rss.xml'), // BBC Sport
      parser.parseURL('https://www.theguardian.com/football/rss') // The Guardian
    ]);

    let allArticles: any[] = [];

    feeds.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const feedName = index === 0 ? 'talkSPORT' : index === 1 ? 'BBC Sport' : 'The Guardian';
        const feedIcon = index === 0 ? 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Talksport_logo.svg/512px-Talksport_logo.svg.png' 
                       : index === 1 ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_Logo_2021.svg/512px-BBC_Logo_2021.svg.png'
                       : 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/The_Guardian_2018.svg/512px-The_Guardian_2018.svg.png';

        const items = result.value.items.map((article: any) => {
          let imageUrl = null;
          if (article.enclosure && article.enclosure.url) {
            imageUrl = article.enclosure.url;
          } else if (article.mediaContent && article.mediaContent.$ && article.mediaContent.$.url) {
            imageUrl = article.mediaContent.$.url;
          }

          let tags = ["Live Football"];
          const titleLower = article.title.toLowerCase();
          
          // Tier-1 Journalist Detection
          if (titleLower.includes('romano')) tags.push('Fabrizio Romano');
          if (titleLower.includes('ornstein')) tags.push('David Ornstein');
          if (titleLower.includes('paul joyce') || titleLower.includes('joyce')) tags.push('Paul Joyce');

          return {
            id: Buffer.from(article.link || '').toString('base64url'),
            source: feedName,
            sourceIconUrl: feedIcon,
            pubDate: article.pubDate ? new Date(article.pubDate).getTime() : 0,
            timeAgo: calculateTimeAgo(article.pubDate),
            headline: article.title,
            imageUrl: imageUrl,
            url: article.link,
            tags: tags
          };
        });
        allArticles = allArticles.concat(items);
      }
    });

    // Sort by newest first
    allArticles.sort((a, b) => b.pubDate - a.pubDate);

    // Return the top 15 breaking news stories
    return NextResponse.json(allArticles.slice(0, 15));
  } catch (error) {
    console.error("RSS Aggregation Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

function calculateTimeAgo(dateStr: string) {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Just now";
  
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}
