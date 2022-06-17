const router = require("express").Router()
// const Post = require("../models/Post")
const mPost = require("../models/mPost")
const mNotification = require("../models/mNotification")
const mImage = require("../models/mImage")
const mComment = require("../models/mComment")
const mUser = require("../models/mUser")
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
          postId: req.body?.postId,
          img: result.secure_url,
          cloudinaryId: result.public_id
         });
      if(req.body.isProfilePic){
        //change profile pic
        // console.log(newImgPost._id.valueOf());
          const oldProfilePic = await mImage.find({ userId: req.body.userId, isProfilePic: "true" })
          await mImage.findOneAndUpdate({"_id": oldProfilePic[0]?._id}, {"isProfilePic": "false"})
          await mImage.findByIdAndUpdate(newImgPost._id.valueOf(), { isProfilePic: "true"})
      }
    res.status(200).json(newImgPost);
  } catch (err) {
    res.status(500).json(err);
    console.log("Error: ", err);
  }
})

//Get timeline posts
router.get("/timeline/:userId", async (req, res) => {
 try {
    //Get all posts and concat them together
    const currentUser = await mUser.findById(req.params.userId);
    const userPosts = await mPost.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(currentUser.following.map((friendId) => {
    return mPost.find({ userId: friendId });
    }));
    const allTimelinePosts = userPosts.concat(...friendPosts);
      //Iterate through the posts if they have an image, and append the image url
    for(let i=0; i<allTimelinePosts.length; i++){
      if(allTimelinePosts[i].hasImg === "true"){
        const postId = allTimelinePosts[i]._id.valueOf();
        const postImg = await mImage.find({ postId: postId })
        const imgUrl = postImg[0]?.img
        allTimelinePosts[i].img = imgUrl
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
    const user = await mUser.findOne({username:req.params.username})
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
        if(post.hasImg === "true"){
          const postCloud = await mImage.find({ postId: post._id.valueOf() })
          if(postCloud[0].cloudinaryId){
            cloudinary.uploader.destroy(postCloud[0].cloudinaryId)
            await mImage.deleteOne({ postId: post._id.valueOf() })
          }
        }
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
      }
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


//Delete a post from the image
router.delete("/deleteImagePost/:id", async (req, res) => {
  try {
    if(req.body.image.postId){
      const post = await mPost.findById(req.body.image.postId);
      await post.deleteOne();
    }

    cloudinary.uploader.destroy(req.body.image.cloudinaryId)
    await mImage.deleteOne({ _id: req.body.image._id })
    res.status(200).json("the post has been deleted");

  } catch (err) {
    res.status(500).json(err);
  }
});


//Get all user photos
router.get("/photos/:username", async (req, res) => {
 try {
   const user = await mUser.findOne({username:req.params.username})
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
     const receiver = await mUser.findById(post.userId)
     const sender = await mUser.findById(req.body.userId)
     
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

//Delete a Notification
router.delete("/:id/deleteNotification", async (deletedNotification, res) => {
    try {
      await mNotification.findByIdAndDelete({ _id: deletedNotification.body.deletedNotification })
      res.status(200).json()
  
    
        } catch (err) {
          res.status(500).json(err);
          console.log(err);
        }
  });




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


//Get comments
router.get("/comment/:id", async (req,res)=>{
  try {
    const comment = await mComment.find({ postID: req.params.id })
    // console.log(comment);
    res.status(200).json(comment)
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
})


//Create a comment
router.post("/:id/comment", async (req,res)=>{

  try {
    const newComment = new mComment(req.body)
    await newComment.save();
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
})


//Delete a comment
router.delete("/:id/deleteComment", async (req, res) => {
  try {
    // console.log(req.body._id);
    await mComment.deleteOne({ _id: req.body._id })
    res.status(200).json()
  } catch (err) {
    res.status(500).json(err);
  }
});


//Update a comment
router.put("/:id/updateComment", async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.body.comment.comment);
   const updatedComment = await mComment.findOneAndUpdate(
     {_id : req.body._id },
     {
       $set: {
         "desc" : req.body.desc
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
         const post = await mPost.findById(req.params.id)
         res.status(200).json(post)
     }catch(err){
         res.status(500).json(err)
     }
 })
  

module.exports = router