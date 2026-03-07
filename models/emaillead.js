const mongoose=require('mongoose');
const emailschema=new mongoose.Schema({
    email:String,
    consent:Boolean,
    eventid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('emailleads',emailschema);