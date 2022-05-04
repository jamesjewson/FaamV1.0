const mongoose = require('mongoose')


const CommentSchema = new mongoose.Schema({
    receiverId:{
        type:String,
        required:true
    },
    senderID:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        max:500
    }
},
{timestamps:true}
)

module.exports = mongoose.model("Comment", CommentSchema)