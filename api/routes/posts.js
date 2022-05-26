const router = require("express").Router()
const Post = require("../models/Post")
const mPost = require("../models/mPost")
const mNotification = require("../models/mNotification")
const mImage = require("../models/mImage")
const User = require("../models/User")
const cloudinary = require("../middleware/cloudinary");
require("dotenv").config()

//Create a post
router.post("/post", async (req,res)=>{
  const newPost = new mPost(req.body)
  try{
    const savedPost = await newPost.save()
    res.status(200).json(savedPost)
  }catch(err){
    console.log(err)
    res.status(501);
  }
  })
  
//Create an image
router.post("/postImg", async (req,res)=>{
  try {
    // Upload image to cloudinary 
    const result = await cloudinary.uploader.upload(req.body.img, {
        upload_preset: 'i7qr7gwc'
      })
      const newImgPost = await mImage.create({
          userId: req.body.userId,
          postId: req.body.postId,
          img: result.secure_url,
          cloudinaryId: result.public_id
         });
    res.status(200).json();
  } catch (err) {
    res.status(500).json(err);
    console.log("Error: ", err);
  }
})

//Get timeline posts
router.get("/timeline/:userId", async (req, res) => {
 try {
   const currentUser = await User.findById(req.params.userId);
   const userPosts = await mPost.find({ userId: currentUser._id });
   const friendPosts = await Promise.all(currentUser.following.map((friendId) => {
       return mPost.find({ userId: friendId });
     })
   );
   const allTimelinePosts = userPosts.concat(...friendPosts);
      //should be postUserId not currentUser._id
      //make an array of each userId in allTimelinePosts, and then search for images with that userId
    let imageUserIdArray = [];
    for(let i=0; i<allTimelinePosts.length; i++){
      if(imageUserIdArray.indexOf(allTimelinePosts[i].userId) === -1){
        imageUserIdArray.push(allTimelinePosts[i].userId);
      }
    }  
    let imageArray = []
    for(let i=0; i<imageUserIdArray.length; i++){
      const imageResult = await mImage.find({ userId: imageUserIdArray[i]})
      imageArray.push(imageResult)
    }
   //Loop through all posts
      for(let j=0; j<allTimelinePosts.length; j++){
        //Get post ID
        let thisPostId = allTimelinePosts[j]._id.valueOf();
        
        //Loop though images
        for(let i=0; i<imageArray.length; i++){
          //Look for post ID that lines up with image post ID
          if(thisPostId === imageArray[i][0].postId){
            //Append
            allTimelinePosts[j].img = imageArray[i][0].img
          }
        }
      }
   res.status(200).json(allTimelinePosts)
 }catch (err) {
   res.status(500).json(err);
   console.log(err)
 }
});


//Get all user posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({username:req.params.username})
    const posts = await mPost.find({ userId: user._id })
    const imag = await mImage.find({userId: user._id})
    //Loop through all posts
      for(let i=0; i<posts.length; i++){
        //Get post ID
        let postId = posts[i]._id.valueOf();
        //Loop though images
        for(const image of imag){
          //Look for post ID that lines up with image post ID
          if(postId == image.postId){
          //Append
          posts[i].img = image.img
        }
      }
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
});

//Delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await mPost.findById(req.params.id);
    if (post.userId === req.body.userId) {
      if (post.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
      }
      if(post.cloudinaryId){
        cloudinary.uploader.destroy(post.cloudinaryId)
      }
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all user photos
router.get("/photos/:username", async (req, res) => {
 try {
   const user = await User.findOne({username:req.params.username})
   const images = await mImage.find({userId: user?._id})
   res.status(200).json(images);
  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
});

//Like a post
 router.put("/:id/like", async (req,res)=>{
  try{
     const post = await mPost.findById(req.params.id)
     const receiver = await User.findById(post.userId)
     const sender = await User.findById(req.body.userId)
     
      if(!post.likes.includes(req.body.userId)){
          await post.updateOne({$push:{likes:req.body.userId}})
          const message = sender.username + " liked your post."

          sendNotification(sender._id, receiver._id, message);
         
         //  await user.updateOne({ $push: { notifications: notification }}) //Update Notifications
           res.status(200).json("The post has been liked")
           
      }else {
          await post.updateOne({ $pull:{likes:req.body.userId}})
          res.status(200).json("The post has been unliked")
      }
  }catch(err){
      res.status(500).json(err)
  }
})


const sendNotification = async (sender, receiver, message)=>{
    const notification = await mNotification.create({
    sender: sender,
    receiver: receiver,
    message: message
  })
}


//Update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await mPost.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      const updatedPost = await mPost.findById(req.params.id)
      res.status(200).json(updatedPost);
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

////////////////////////////////////////
//////////Working/////////////////







////////Old Code that works///////////
// //Update a post
// router.put("/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (post.userId === req.body.userId) {
//       await post.updateOne({ $set: req.body });
//       const updatedPost = await Post.findById(req.params.id)
//       res.status(200).json(updatedPost);
//     } else {
//       res.status(403).json("you can update only your post");
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });



// //Get timeline posts
// router.get("/timeline/:userId", async (req, res) => {
//  try {
//    const currentUser = await User.findById(req.params.userId);
//    const userPosts = await mPost.find({ userId: currentUser._id });
//    const friendPosts = await Promise.all(currentUser.following.map((friendId) => {
//        return mPost.find({ userId: friendId });
//      })
//    );
//    const allTimelinePosts = userPosts.concat(...friendPosts);
//       //should be postUserId not currentUser._id
//       //make an array of each userId in allTimelinePosts, and then search for images with that userId    
//    const imag = await mImage.find({userId: currentUser._id})
//    //Loop through all posts
//      for(let i=0; i<allTimelinePosts.length; i++){
//      //Get post ID
//      let postId = allTimelinePosts[i]._id.valueOf();
//      //Loop though images
//      for(const image of imag){
//        //Look for post ID that lines up with image post ID
//        if(postId == image.postId){
//          //Append
//          allTimelinePosts[i].img = image.img
//        }
//      }
//    }
//    res.status(200).json(allTimelinePosts)
//  }catch (err) {
//    res.status(500).json(err);
//    console.log(err)
//  }
// });

 //Like a post
//  router.put("/:id/like", async (req,res)=>{
//   try{
//      const post = await mPost.findById(req.params.id)
//      const user = await User.findById(post.userId)
//      const currentUser = await User.findById(req.body.userId)

//       if(!post.likes.includes(req.body.userId)){
//           await post.updateOne({$push:{likes:req.body.userId}})

//           //Send Notification
//           const notificationId = (Math.floor(10000000000 + Math.random() * 90000000000))
//           const follower = {
//             username: currentUser.username,
//             profilePicture: currentUser.profilePicture,
//             id: currentUser._id
//            }
//            const message = currentUser.username + " liked your post."
//            const notification = {
//              follower: follower,
//              message: message,
//              id: notificationId
//            }
//            await user.updateOne({ $push: { notifications: notification }})
//            res.status(200).json("The post has been liked")
           
//       }else {
//           await post.updateOne({ $pull:{likes:req.body.userId}})
//           res.status(200).json("The post has been unliked")
//       }
//   }catch(err){
//       res.status(500).json(err)
//   }
// })






//  //Get all user photos
//  router.get("/photos/:username", async (req, res) => {
//   try {
//     const user = await User.findOne({username:req.params.username})
//     const posts = await Post.find({ userId: user?._id, img:{$ne:null} })
//     res.status(200).json(posts);
//    } catch (err) {
//      res.status(500).json(err);
//      console.log(err)
//    }
//  });





 //Get timeline post
//  router.get("/timeline/:userId", async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.params.userId);
//     const userPosts = await Post.find({ userId: currentUser._id });
//     const friendPosts = await Promise.all(currentUser.following.map((friendId) => {
//         return mPost.find({ userId: friendId });
//       })
//     );
//     res.status(200).json(userPosts.concat(...friendPosts))
//     console.log(userPosts);
//   }catch (err) {
//     res.status(500).json(err);
//     console.log(err)
//   }
// });

// //Get all user posts
// router.get("/profile/:username", async (req, res) => {
//   try {
//     const user = await User.findOne({username:req.params.username})
//     const posts = await mPost.find({ userId: user._id })
//     console.log(user._id);
//     res.status(200).json(posts);
//   } catch (err) {
//     res.status(500).json(err);
//     console.log(err)
//   }
// });


////////////////////////////

//Create a comment
router.put("/:id/comment", async (req,res)=>{

  try {
    const post = await Post.findById(req.body.parentPostId);
    //OP user
    const user = await User.findById(post.userId)
    //Current user
    const currentUser = await User.findById(req.body.user._id)
    const notificationId = (Math.floor(10000000000 + Math.random() * 90000000000))
    const follower = {
      username: currentUser.username,
      profilePicture: currentUser.profilePicture,
      id: currentUser._id
    }
    const message = currentUser.username + " commented on your post."
    const notification = {
      follower: follower,
      message: message,
      id: notificationId
    }
    await user.updateOne({ $push: { notifications: notification }})
    await post.updateOne({ $push: {comments: req.body} });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
})


//Delete a comment
router.put("/:id/deleteComment", async (req, res) => {
  try {
   const deletedComment = await Post.update( 
     {"_id": req.body.comment.parentPostId},
    {
      $pull: {
        comments: { commentId: req.body.comment.commentId } 
      }
   });
   res.status(200).json(deletedComment)
      } catch (err) {
        res.status(500).json(err);
      }
});

//Update a comment
router.put("/:id/updateComment", async (req, res) => {
  try {
    // console.log(req.body.comment.comment);
   const updatedComment = await Post.findOneAndUpdate(
     {_id : req.body.comment.parentPostId,
      "comments.commentId" : req.body.comment.commentId
    },
     {
       $set: {
         "comments.$.comment" : req.body.comment.comment
       }
     })
   res.status(200).json(updatedComment)
      } catch (err) {
        res.status(500).json(err);
        console.log(err);
      }
});






 

 
 //Get a post
 router.get("/:id", async(req,res)=>{
     try{
         const post = await Post.findById(req.params.id)
         res.status(200).json(post)
     }catch(err){
         res.status(500).json(err)
     }
 })
  


module.exports = router