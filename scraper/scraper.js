const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const Event = require('../models/Event');
const axios = require("axios");
async function eventscrape() {
  await Event.updateMany({}, { status: "old" });
  const events = [];

  const listUrl = "https://www.eventbrite.com.au/d/australia--sydney/events/";
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--single-process"
    ]
});
  const page = await browser.newPage();

  await page.goto(listUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000
});

  await page.evaluate(() => {
    return new Promise((resolve) => {
        let timer;

        const observer = new MutationObserver(() => {
            clearTimeout(timer);

            timer = setTimeout(() => {
                observer.disconnect();
                resolve();
            }, 2000);
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true
        });

        // In case there are no changes
        timer = setTimeout(() => {
            observer.disconnect();
            resolve();
        }, 2000);
    });
});
  
  const html = await page.content();
  const $ = cheerio.load(html);


  // Correct selector for event links
  $("a[href*='/e/']").each((i, el) => {
       const title = $(el).text().trim();
      const href = $(el).attr("href");
        const city=$(el).attr("data-event-location");
        const category=$(el).attr("data-event-category");
        if(!title||!href) return;
        events.push({
          title,
          eventUrl: href.startsWith("http")
            ? href
            : "https://www.eventbrite.com.au" + href,
          city: city,
          source: "Eventbrite",
          category:category
        });
    
  });
 const uniqueEvent=[
  ...new Map(events.map(e=>[e.eventUrl,e])).values()
 ];


  for (let e of uniqueEvent) {
    try {
      const details = await getEventDetails(browser, e.eventUrl);
      await Event.findOneAndUpdate(
  { eventUrl: e.eventUrl }, // find by URL
  {
    $set: {
      ...e,
      ...details,
      lastScraped: new Date(),
      status: "new"
    }
  },
  { upsert: true } // create if not exist
);

      console.log("Saved:", e.title);

    }  catch (err) {
    console.log("FAILED:", e.eventUrl);
    console.log("REASON:", err.message);
}
  }

  console.log("Done. Events:", events.length);
  await browser.close();
}

async function getEventDetails(browser, url) {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000
});

  const html = await page.content();
  const $ = cheerio.load(html);
  const date = $("time").first().text().trim();

  const venueText = await page.$eval(
  '[data-testid="event-venue"]',
  el => el.textContent.trim()
);

  // const description = $(".Overview_summaryWrapper__xGQx4").text().trim().slice(0, 200);
  let image = $("img[class*='HeroImage']").attr("src");

if(image && image.includes("url=")){
  const encoded = image.split("url=")[1].split("&")[0];
  image = decodeURIComponent(encoded);
}

  await page.close();

  return { venueText, image, date};
}



module.exports = eventscrape;