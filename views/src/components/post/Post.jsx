import "./post.css"
import { MoreVert, Favorite, HighlightOff } from "@material-ui/icons"
import axios from "axios"
import { useContext, useEffect, useState, useRef } from 'react'
import {format} from 'timeago.js'
import {Link} from "react-router-dom"
import {AuthContext} from "../../context/AuthContext"
import Comments from "../comments/Comments"
import PostDropdown from "../postDropdown/PostDropdown"
 

export default function Post({post, deletePost}) {
    
    const [like, setLike] = useState(post.likes.length)
    const [isLiked, setIsLiked] = useState(false)
    const [user, setUser] = useState({})
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user:currentUser} = useContext(AuthContext)
    const [showComments, setShowComments] = useState(false)
    const [viewImg, setViewImg] = useState(false)
    let refClick = useRef()
    const [showPostDropdown, setShowPostDropdown] = useState(false)
    const [editingPost, setEditingPost] = useState(false)
    const [inputValue, setInputValue] = useState("")

    //Event listeners for outside dropdown menu click
    useEffect(() => {
        document.addEventListener("click", handleShowDropdown)
        return () => {
            document.removeEventListener("click", handleShowDropdown)
        }
    }, [])

    //Set liked or not
    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id))
    },[currentUser._id,post.likes])

    //Fetch user    
    useEffect(() =>{
        const fetchUser = async () => {
            const res = await axios.get(`/users?userId=${post.userId}`)
            setUser(res.data);
        };  
        fetchUser();
    },[post.userId]); 

    //Set Input Value
    useEffect(() => {
        setInputValue(post?.desc)
        
    }, [post?.desc])

    
    
    // Show Post Dropdown Menu
    const clickShowPostDropdown = ()=>{
        showPostDropdown ? setShowPostDropdown(false) : setShowPostDropdown(true)
    }
    
    
    // Show/hide comments
    const clickShowComments = ()=> { 
        showComments ? setShowComments(false) : setShowComments(true) 
    }

    // Like Handler
    const likeHandler =()=>{
        try{
            axios.put("/posts/"+post._id+"/like", {userId:currentUser._id})
        }catch(err){
            console.log(err)
        }
        setLike(isLiked ? like-1 : like+1)
        setIsLiked(!isLiked)
    }


    //Confirm delete
    const confirmDelete =()=>{
        if(currentUser._id === post.userId){

            try {
                if(window.confirm("Delete this post? (This cannot be undone.)") === true){
                    const deletedPost = {
                        postId: post._id,
                        currentUser: currentUser
                    }
                    deletePost(deletedPost)  
                }
            } catch (err) {
                console.log(err);
            }
        }else{
            alert("You cannot delete someone else's post!")
        }
    }



    
    // Edit Post
    const editPost = async (e)=>{
        e.preventDefault()
        if(currentUser._id === post.userId){
            setEditingPost(true)
        }else{
            alert("you can only edit your own posts")
        }
    }

    // Save Edited Post
    const savePost = async (e)=>{
        e.preventDefault()
        try {
            if(inputValue !== "" && inputValue !== null){
                const updatedPost = {
                    desc: inputValue,
                    userId: currentUser._id
                }
                try {
                    const res = await axios.put("/posts/" + post._id, updatedPost)
                    console.log(res.data);
                    if(res.status === 200){
                        setEditingPost(false)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Cancel edit post
    const cancelEditPost = (e)=>{
        e.preventDefault()
        setEditingPost(false)
    }


    //Handle dropdown outside click
    const handleShowDropdown = (e)=>{
        if(!refClick.current?.contains(e.target)){
            setShowPostDropdown(false)
        }
    }


    // Hide large photo
    const hideLargeImage = ()=>{
        setViewImg(false)
     }




//////////////////////
//Return
    return (
        <div className="post">
           <div className="postWrapper">
               <div className="postTop">
                   <div className="postTopLeft">
                       <Link to={`/profile/${user.username}`}>
                        <img 
                            className="postProfileImg" 
                            src={user.profilePicture ? user.profilePicture : PF+"person/noAvatar.jpeg"} 
                            alt="" 
                        />
                        </Link>
                        <Link to={`/profile/${user.username}`}>
                        <span 
                            className="postUsername">{user.username}
                        </span>
                        </Link>
                        <span className="postDate">{format(post.createdAt)}</span>
                   </div>
                   <div className="postTopRight">
                        {showPostDropdown ?  <PostDropdown confirmDelete={confirmDelete} editPost={editPost} className="postDropdown" /> : null}
                        <MoreVert className="postDropDown" onClick={clickShowPostDropdown} ref={refClick} />
                   </div>
                </div>
                {/* Edit Post */}
                {editingPost ? (
                    <div className="postCenter">
                        <input type="text" className="postText editPostTextInput" autoFocus value={inputValue} onChange={(e)=> setInputValue(e.target.value)} />
                        <img className="postImg" src={post?.img} alt="" />
                        <button className="editPostButton" type="button" onClick={savePost}>Save</button>
                        <button className="editPostButton cancelEditPostButton" type="button" onClick={cancelEditPost}>Cancel</button>
                    </div>
                ):(
                   <div className="postCenter">
                   {/* Adding ? allows for blank if that property has no value */}
                        <span className="postText">{inputValue}</span>
                        <img className="postImg" src={post?.img} alt="" onClick={()=>{setViewImg(post)}} />
                   </div>   
                )}
            {/* View Large Image */}
            {/* Style is under rightbar.css */}
                { viewImg ? (
                    <>
                        <div className="largeImgContainer">
                            <HighlightOff onClick={hideLargeImage} className="hideLargeImg" />
                            <img src={viewImg.img} className="viewLargeImage" alt={viewImg?.desc} />
                        </div>
                    </>
                ) : null }
               <div className="postBottom">
                   <div className="postBottomLeft">
                       <Favorite onClick={likeHandler} style={ isLiked ?  {color:"red"}: {color: "black"}}  />
                        <span className="postLikeCounter">{like} people like this</span>
                   </div>
                   <div className="postBottomRight">
                       <span onClick={clickShowComments} className="postCommentText" >
                           <span className="postCommentSpan">Comments </span> 
                           <div className="postCommentLength">

                           {(post.comments?.length > 0) ? (
                               " (" + post.comments.length + ")"
                               ) : null }
                            </div>
                        </span>
                   </div>
               </div>
           { showComments ? <Comments {...post} /> : null }
           </div>
        </div>
    )





}
