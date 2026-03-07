const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const scrape=require('./scraper/scraper');
const eventschema=require('./models/Event');
const emailschema=require('./models/emaillead')
const cron=require('node-cron');
const app=express();
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/sydneyEvents').then(()=>{console.log('database connnected')}).catch((e)=>{console.log(e)});
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get('/scrape',async(req,res)=>{
    await scrape();
    res.end("scrapped");
})
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
    const data = await YourModel.find({}); // MongoDB example
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});
app.listen('2100',()=>{
    console.log("connection built");
    
})