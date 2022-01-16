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
    profilePicture:{
        type:String,
        default:""
    },
    cloudinaryProfilePicId:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""     
    },
    cloudinaryCoverPicId:{
        type:String,
        default:""
    },
    followers:{
        type:Array,
        default:[],
    },
    following:{
        type:Array,
        default:[],
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    desc:{
        type:String,
        max:50
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
    faams:{
        type:Array,
        default:[]
    },
    notifications:{
        type:Array,
        default:[]
    }
},
{timestamps:true}
)

module.exports = mongoose.model("User", UserSchema)