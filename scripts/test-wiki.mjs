import * as cheerio from "cheerio";

async function test() { 
  const res = await fetch('https://en.wikipedia.org/wiki/2024%E2%80%9325_Arsenal_F.C._season'); 
  const html = await res.text(); 
  const $ = cheerio.load(html); 
  const squad = []; 
  $('tr.vcard').each((_, el) => { 
    squad.push($(el).text().trim().replace(/\n/g, ' ')); 
  }); 
  console.log('Found vcards:', squad.length); 
  if (squad.length > 0) {
    console.log(squad[0]);
  } else { 
    console.log('Checking tables...'); 
    $('table').each((i, t) => { 
      const headers = $(t).find('tr').first().text().replace(/\n/g, ' ').trim();
      if (headers) console.log(`Table ${i}: ${headers.substring(0, 50)}`);
    }); 
  } 
}
test();
