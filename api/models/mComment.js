const mongoose = require('mongoose')


const CommentSchema = new mongoose.Schema({
    commenterID:{
        type:String,
        required:true
    },
    postID:{
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

module.exports = mongoose.model("mComment", CommentSchema)