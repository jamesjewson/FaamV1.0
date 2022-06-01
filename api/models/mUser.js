const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        require:true,
        max:50,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        min:4,
    },
    followers:{
        type:Array,
        default:[],
    },
    following:{
        type:Array,
        default:[],
    },
    currentCity:{
        type:String,
        max:50
    },
    from:{
        type:String,
        max:50
    },
    relationship:{
        type:String,
        max: 50
    },
    profilePicture:{
        type:String,
        max: 200
    }
    
},
{timestamps:true}
)

module.exports = mongoose.model("mUser", UserSchema)