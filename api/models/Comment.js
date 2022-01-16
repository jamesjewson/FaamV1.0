//This model will be utilized in a future update
const mongoose = require('mongoose')


const CommentSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        max:500
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
},
{timestamps:true}
)

module.exports = mongoose.model("Comment", CommentSchema)