//This model will be utilized in a future update
const mongoose = require('mongoose')


const FaamSchema = new mongoose.Schema({
    faamId:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverPicture:{
        
        type:String,
        default:""
        
    },
    headOfHousehold:{
        type:Array,
        default:[],
        required:true
    },
    members:{
        type:Array,
        default:[],
        required:true
    }
})

module.exports = mongoose.model("Post", FaamSchema)