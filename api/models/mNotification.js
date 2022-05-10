const mongoose = require('mongoose')


const NotificationSchema = new mongoose.Schema({
    //The user who will receive the notification
    //The user that did something
    sender:{
        type:String,
        required:true
    },
    receiver:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
   
},
{timestamps:true}
)

module.exports = mongoose.model("Notification", NotificationSchema)