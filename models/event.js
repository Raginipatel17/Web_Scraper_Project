const mongoose=require('mongoose');
const Event=new mongoose.Schema({
    title:String,
    venue:String,
    city:String,
    description:String,
    category:String,
    image:String,
    source:String,
    eventUrl:String,
    lastscraped:Date,
    status:{type:String, enum:['new','updated','inactive','imported'],default:"new"}

})
module.exports=mongoose.models.Event||mongoose.model("Event",Event);