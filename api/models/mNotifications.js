const mongoose = require('mongoose')


const NotificationSchema = new mongoose.Schema({
    //The user who will receive the notification
    receiverUserID:{
        type:String,
        required:true
    },
    //The user that did something
    senderUserID:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    }
   
},
{timestamps:true}
)

module.exports = mongoose.model("Notification", NotificationSchema)