const router = require("express").Router()
const User = require("../models/User")
const mUser = require("../models/mUser")
const mImage = require("../models/mImage")
const bcrypt = require("bcrypt")
const cloudinary = require("../middleware/cloudinary");
const mNotification = require("../models/mNotification")


router.get("/allUsers", async (req,res)=>{
  try {
    const allUsers = await mUser.find()
    // console.log(allUsers.length);
    for(let i=0; i<allUsers.length; i++){
      // console.log(allUsers[i]._id.valueOf());
      const userProfilePic = await mImage?.find({ userId: allUsers[i]._id.valueOf(), isProfilePic: "true" })

      allUsers[i].profilePicture = userProfilePic[0]?.img
    }
    // console.log(allUsers);
    res.status(200).json(allUsers)  
  } catch (error) {
    res.status(501)
    console.log(error);
  }
})

//Get a user
router.get("/", async (req,res)=>{
  // console.log(req.query);
  const userId = req.query?.userId;
  const username = req.query?.username;
  console.log(username);
  try{
      const user = userId ? await mUser.findById(userId) : await mUser.findOne({username:username});
      //This line removes password and updatedAt in the response, but sends everything else. Other can be called whatever you want   
      const {password,updatedAt, ...other} = user._doc
      const userProfilePic = await mImage?.find({ userId: other._id, isProfilePic: "true" })
      other.profilePicture = userProfilePic[0]?.img
      res.status(200).json(other)
  }catch (err){
      res.status(500).json(err)
  }
})


router.get("/currentUser/:userId", async (req,res)=>{
const userId = req.params.userId;
try {
  const user = await mUser.findById(userId)
  const {password,updatedAt, ...other} = user?._doc
  const userProfilePic = await mImage?.find({ userId: other._id, isProfilePic: "true" })
  other.profilePicture = userProfilePic[0]?.img
  res.status(200).json(other)
  
} catch (error) {
  console.log(error);
}
})



//Notifications
router.get("/notifications/:id", async (req,res)=>{
  try {
    //find all notifications with userId 
    const notifications = await mNotification.find({ receiver: req.params.id })
    let i = 0;
    for(const notification of notifications){
      //Get sender ID
      const senderStuff = await mUser.find({ _id: notification.sender})
      // console.log(senderStuff);
      const userProfilePic = await mImage.find({ userId: senderStuff[0]._id, isProfilePic: "true" })
      // other.profilePicture = userProfilePic[0].img
      notifications[i].senderPic = userProfilePic[0].img
      //Not having this next line breaks it...
      notifications[i].senderName = senderStuff[0].username
      // console.log(notifications[i]);
      i++
    }
    res.status(200).json(notifications)
    
  } catch (error) {
    console.log(error);
  }
})




//Follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await mUser.findById(req.params.id);
      const currentUser = await mUser.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
       
        //Update following
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        //Send notification to followed user
  

        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await mUser.findById(req.params.id);
      const currentUser = await mUser.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

//get friends (This should still work, just switch user to mUser)
router.get("/friends/:userId", async (req,res)=>{
  try{
      const user = await mUser.findById(req.params.userId)
      const friends = await Promise.all(
          user.following.map(friendId=>{
              return mUser.findById(friendId)
      }))
      let friendList = [];
      // console.log(friends.length)
      for(let i=0; i< friends.length; i++){
        // console.log(friends[i]._id.valueOf())
        const userProfilePic = await mImage.find({ userId: friends[i]._id.valueOf(), isProfilePic: "true" })
        // console.log("Profile Pic: " + userProfilePic[0].img);
        friends[i].profilePicture = userProfilePic[0].img
        const friend = { 
          _id: friends[i]._id,
          profilePicture: friends[i].profilePicture,
          username: friends[i].username
        }
        // console.log(friends[i]);
        friendList.push(friend)
      }

      res.status(200).json(friendList)
  }catch(err){
      res.status(500).json(err)
  }
})


//Update User (This should still work, just switch user to mUser)
  //Having /:id allows any id to be the url
  router.put("/:id", async(req,res)=>{
    //Check to see if it's the user
    if(req.body.userId === req.params.id || req.body.isAdmin){
        //If they want to change the password, to be used in the future
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err){
                return res.status(500).json(err)
            }
        }
        try{
            // console.log(req.body)
            const user = await mUser.findByIdAndUpdate(req.params.id, {$set: req.body,})
            res.status(200).json("Account has been updated")
        } catch (err){
            return res.status(500).json(err)
        }
    }else {
        return res.status(403).json("You can update only your account")
    }

})


//Delete User (This should still work, just switch user to mUser)
    //Having /:id allows any id to be the url
    router.delete("/:id", async(req,res)=>{
      //Check to see if it's the user
      if(req.body.userId === req.params.id || req.body.isAdmin){
          try{
              const user = await mUser.findByIdAndDelete({ _id: req.params.id})
              res.status(200).json("Account has been deleted")
          } catch (err){
              return res.status(500).json(err)
          }
      }else {
          return res.status(403).json("You can delete only your account")
      }
  })

module.exports = router