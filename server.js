const express=require('express');
const cors=require('cors');
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const scrape=require('./scraper/scraper');
const eventschema=require('./models/Event');
const emailschema=require('./models/emaillead')
const cron=require('node-cron');
const app=express();
app.use(cors());
app.use(express.json());

// mongoose.connect('mongodb+srv://Sydney_scraper:Ragini5122@scraperdatabase.lgcp3vk.mongodb.net/?appName=scraperDatabase').then(async()=>{console.log('database connnected'); await scrape();}).catch((e)=>{console.log(e)});

// mongoose.connect('mongodb+srv://Sydney_scraper:Sydney%40scraper@scraperdatabase.lgcp3vk.mongodb.net/?appName=scraperDatabase').then(()=>{console.log('database connnected')}).catch((e)=>{console.log(e)});
// const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv:Sydney_scraper:Sydney%40scraper@scraperdatabase.lgcp3vk.mongodb.net/test?appName=scraperDatabase', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("MongoDB connected!"))
// .catch(err => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get('/scrape', async (req, res) => {
  try {
    await scrape();
    res.send("scraped successfully");
  } catch (err) {
    console.log("SCRAPER ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
app.post('/email',async(req,res)=>{
    const {email,consent,eventid}=req.body;
    await emailschema.create({email,consent,eventid});
    const event=await eventschema.findById(eventid);
    res.send({
        success:true,
        redirectUrl:event.eventUrl
    });
});
app.get('/events', async (req, res) => {
    const events = await eventschema.find();
    res.send(events);
});

cron.schedule("*/10 * * * *", async () => {
  console.log("Running scraper...");

  await eventschema.updateMany({}, { status: "old" });

  await scrape();

  await eventschema.deleteMany({ status: "old" });

});
app.get('/test-db', async (req, res) => {
  try {
    const data = await eventschema.find({}); // MongoDB example
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});
async function startServer() {
    try {
        await mongoose.connect(
            'mongodb+srv://Sydney_scraper:Ragini5122@scraperdatabase.lgcp3vk.mongodb.net/?appName=scraperDatabase'
        );

        console.log("Database connected");

        app.listen(2100, () => {
            console.log("Server is running on port 2100");
        });

        // Run scraper once when server starts
        console.log("Running initial scraper...");
        await scrape();

        console.log("Initial scraping completed");

    } catch (error) {
        console.error("STARTUP ERROR:", error);
    }
}

startServer();
