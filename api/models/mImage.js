const mongoose = require('mongoose')


const ImageSchema = new mongoose.Schema({
    img:{
        type:String,
        required: true
    },
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
    }
},
{timestamps:true}
)

module.exports = mongoose.model("Image", ImageSchema)