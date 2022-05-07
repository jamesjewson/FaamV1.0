const mongoose = require('mongoose')


const mPostSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        max:500
    },
    //Array of user ID's
    likes:{
        type:Array,
        default:[]
    },
    hasImg:{
        type:Boolean,
        default: false
    }
},
{timestamps:true}
)

module.exports = mongoose.model("mPost", mPostSchema)