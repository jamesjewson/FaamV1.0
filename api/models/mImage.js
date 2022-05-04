const mongoose = require('mongoose')


const ImageSchema = new mongoose.Schema({
    cloudinaryId:{
        type:String,
        required: true
    },
    userId:{
        type:String,
        required: true
    },
    postId:{
        type:String
    },
    //The get on the client side will look for an image with this set as true
    isProfilePic:{
        type:Boolean,
        default:false
    },
    img:{
        type:String,
        required: true
    }
},
{timestamps:true}
)

module.exports = mongoose.model("Image", ImageSchema)