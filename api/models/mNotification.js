const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
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
    },
    senderPic:{
        type:String,
        default: ""
    }
   
},
{timestamps:true}
)

module.exports = mongoose.model("Notification", NotificationSchema)