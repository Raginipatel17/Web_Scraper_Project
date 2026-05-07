const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const Event = require('../models/Event');
const axios = require("axios");
async function eventscrape() {
  await Event.updateMany({}, { status: "new" });
  const events = [];

  const listUrl = "https://www.eventbrite.com.au/d/australia--sydney/events/";
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();

  await page.goto(listUrl, { waitUntil: "networkidle2" });
  await page.evaluate(async () => {
    window.scrollBy(0, window.innerHeight);
    await new Promise(r => setTimeout(r, 3000));
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
      status: "active"
    }
  },
  { upsert: true } // create if not exist
);

      console.log("Saved:", e.title);

    } catch (err) {
      console.log("Failed:", e.eventUrl);
    }
  }

  console.log("Done. Events:", events.length);
  await browser.close();
}

async function getEventDetails(browser, url) {
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  const html = await page.content();
  const $ = cheerio.load(html);

  const venue = $(".EventDetails_venueAndDateTimeWrapper__TO15z").text().trim();
  const description = $(".Overview_summaryWrapper__xGQx4").text().trim().slice(0, 200);
  let image = $("img[class*='HeroImage']").attr("src");

if(image && image.includes("url=")){
  const encoded = image.split("url=")[1].split("&")[0];
  image = decodeURIComponent(encoded);
}

  await page.close();

  return { venue, description, image };
}



module.exports = eventscrape;
