const fs = require('fs');
const cheerio = require('cheerio');

// 対象のHTMLファイル
const files = ['index.html', 'diary.html', 'air-pressure-changes.html', 'weather-changes.html'];

let urls = [];

files.forEach(file => {
  const html = fs.readFileSync(file, 'utf-8');
  const $ = cheerio.load(html);

  // ページ自体のURLを追加
  urls.push(`<url><loc>https://azarasijiyuu.f5.si/${file}</loc></url>`);

  // diary.htmlの場合、<article>ごとに個別URLも追加する場合（例: fragment付き）
  if(file === 'diary.html') {
    $('article').each((i, el) => {
      const date = $(el).find('time').attr('datetime') || `entry${i+1}`;
      urls.push(`<url><loc>https://azarasijiyuu.f5.si/diary.html#${date}</loc></url>`);
    });
  }
});

// sitemap.xml を生成
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap);
console.log('sitemap.xml を生成しました！');
