const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")


//Register
router.post("/register", async (req,res)=>{
    try{
        //generate new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
        //Save user and return response
        const user = await newUser.save()
        res.status(200).json()
    }catch(err){
        res.status(500).send(err)
        console.log(err)
        
    }
})


//Login
router.post("/login", async (req,res, next)=>{
   try{
    //Check to see if user exists
    const user = await User.findOne({email:req.body.email})
    !user && res.status(404).send("User not found");
    //Check for password
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    res.status(200).json(user)
    console.log(user)
   }catch(err) {
        res.status(500).json(err)
   }    
})

//Logout
router.post("/logout", async (req,res, next)=>{
    try{
    // const user = null;
     res.status(200).json("logged out")
    }catch(err) {
         res.status(500).json(err)
    }    
 })


module.exports = router