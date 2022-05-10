const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const cloudinary = require("../middleware/cloudinary");
const mNotification = require("../models/mNotification")


router.get("/allUsers", async (req,res)=>{
  try {
    const allUsers = await User.find()
    res.status(200).json(allUsers)  
  } catch (error) {
    res.status(501)
    console.log(error);
  }
})



// Update a profile picture (Call posts/postImg, set isProfilePic to true, and set isProfilePic to false on old pic)
router.put("/:id/profilePicture", async(req,res)=>{
  //Check to see if it's the user
  if(req.body.id === req.params.id || req.body.isAdmin){
    // Upload to cloudinary
    try {       
      const result = await cloudinary.uploader.upload(req.body.data, { upload_preset: 'i7qr7gwc'})
      const currentPic = await User.findById(req.params.id)
      const currentPicId = currentPic.cloudinaryProfilePicId
      const cloudinaryProfilePicId = result.public_id

      //Update Image
      const newPic = await User.findByIdAndUpdate(req.params.id, {
        profilePicture: result.secure_url,
        cloudinaryProfilePicId: cloudinaryProfilePicId
     });  
      res.status(200).json();
      if((res.status(200))){
        
        //Delete currentPic
        try {
          cloudinary.uploader.destroy(currentPicId)
          console.log("old pic deleted")
          res.status(200).json()
        } catch (error) {
          console.log(error)
          res.status(500).json(err)
          console.log(err);
        }
      }
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  }else {
      return res.status(403).json("You can update only your account")
  }
})



// Update a cover picture (Remove this)
router.put("/:id/coverPicture", async(req,res)=>{
   //Check to see if it's the user
   if(req.body.id === req.params.id || req.body.isAdmin){
     // Upload to cloudinary
     try {       
       const result = await cloudinary.uploader.upload(req.body.data, { upload_preset: 'i7qr7gwc'})
       const currentPic = await User.findById(req.params.id)
       const currentPicId = currentPic.cloudinaryCoverPicId
       const cloudinaryCoverPicId = result.public_id
      //Update Image
        const newPic = await User.findByIdAndUpdate(req.params.id, {
            coverPicture: result.secure_url,
            cloudinaryCoverPicId: cloudinaryCoverPicId
      });  
       res.status(200).json();
       if((res.status(200))){
         //Delete currentPic
         try {
           cloudinary.uploader.destroy(currentPicId)
           console.log("old pic deleted")
           res.status(200).json()
         } catch (error) {
           console.log(error)
           res.status(500).json(error)
         }
       }
     } catch (err) {
       res.status(500).json(err);
       console.log(err);
     }
   }else {
       return res.status(403).json("You can update only your account")
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
            const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body,})
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
                const user = await User.findByIdAndDelete({ _id: req.params.id})
                res.status(200).json("Account has been deleted")
            } catch (err){
                return res.status(500).json(err)
            }
        }else {
            return res.status(403).json("You can delete only your account")
        }
    })


//Get a user (This should still work, just switch user to mUser)
router.get("/", async (req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;
    try{
        const user = userId ? await User.findById(userId) : await User.findOne({username:username});
        //This line removes password and updatedAt in the response, but sends everything else. Other can be called whatever you want
        const {password,updatedAt, ...other} = user._doc
        res.status(200).json(other)
    }catch (err){
        res.status(500).json(err)
    }
})


//Get current user (This should still work, just switch user to mUser)
router.get("/currentUser/:userId", async (req,res)=>{
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId)
    const {password,updatedAt, ...other} = user._doc
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
      const senderStuff = await User.find({ _id: notification.sender})
      notifications[i].senderPic = senderStuff[0].profilePicture
      //Not having this next line breaks it...
      notifications[i].senderName = senderStuff[0].username
      // console.log(notifications[i]);
      i++
    }
    // console.log("here" + notifications);
    res.status(200).json(notifications)
    
  } catch (error) {
    console.log(error);
  }
})







// //Notifications
// router.get("/notifications/:id", async (req,res)=>{
//   try {
//     const user = await User.findById(req.params.id)
//     const notifications = user.notifications
//     res.status(200).json(notifications)

//   } catch (error) {
//     console.log(error);
//   }
// })

//get friends (This should still work, just switch user to mUser)
router.get("/friends/:userId", async (req,res)=>{
    try{
        const user = await User.findById(req.params.userId)
        const friends = await Promise.all(
            user.following.map(friendId=>{
                return User.findById(friendId)
        }))
        let friendList = [];
        friends.map(friend=>{
            const {_id,username,profilePicture} = friend;
            friendList.push({_id,username,profilePicture})
        });
            res.status(200).json(friendList)
    }catch(err){
        res.status(500).json(err)
    }
})




//Follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
         
          //Update following
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { following: req.params.id } });
          //Send notification to followed user
          const notificationId = (Math.floor(10000000000 + Math.random() * 90000000000))
          const follower = {
            username: currentUser.username,
            profilePicture: currentUser.profilePicture,
            id: currentUser._id
          }
          const message = currentUser.username + " has followed you."
          const notification = {
            follower: follower,
            message: message,
            id: notificationId
          }
          await user.updateOne({ $push: { notifications: notification } })

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


//Delete a notification
router.delete("/:id/deleteNotification", async (deletedNotification, res) => {
  try {
    let deletedNotificationID = deletedNotification.body.deletedNotification
    // console.log(deletedNotificationID);
    const user = await mNotification.findByIdAndDelete({ _id: deletedNotificationID})
    res.status(200).json()

  
      } catch (err) {
        res.status(500).json(err);
        console.log(err);
      }
});
// //Delete a notification
// router.put("/:id/deleteNotification", async (req, res) => {
//   try {
//    const deletedNotification = await User.update( 
//      {"id": req.params.id},
//     {
//       $pull: {
//         notifications: { id: req.body.id } 
//       }
//    });
//    res.status(200).json()
//       } catch (err) {
//         res.status(500).json(err);
//         console.log(err);
//       }
// });






//Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
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

module.exports = router