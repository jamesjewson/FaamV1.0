import "./feed.css"
import {useContext, useEffect, useState} from "react";
import Share from "../share/Share"
import Post from "../post/Post"
import axios from "axios"
import {AuthContext} from "../../context/AuthContext"
import { ArrowUpward } from "@material-ui/icons"

export default function Feed({ username }) {
    const [posts,setPosts] = useState([])
    const {user} = useContext(AuthContext)
   
// Fetch posts
    useEffect(() =>{
        const fetchPosts = async () => {
        const res = username ? await axios.get("/posts/profile/" + username) : await axios.get("posts/timeline/" + user._id)
            setPosts(res.data.sort((p1,p2)=>{
                return new Date(p2.createdAt) - new Date(p1.createdAt);
            }));
    } 
       fetchPosts();
    },[username, user._id])


//Delete a post
const deletePost = async (deletedPost) => {
    try {
       await axios.delete("/posts/"+deletedPost.postId, { data: {userId:deletedPost.currentUser._id}})
       setPosts(posts.filter((post) => post._id !== deletedPost.postId))
    } catch (err) {
        console.log(err);
        alert('You can only delete your own posts')
    }
}


//Render new post
const renderNewPost = (newPost)=>{
    try {
        setPosts([newPost, ...posts ])
    } catch (error) {
        console.log(error);
    }
}


    //Check Location
    const currentLocation = window.location.pathname;

const scrollTop= ()=>{
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


/////////
    return (
        <div className="feed">
            <div className="feedWrapper">
                
                {((!username || username === user.username) && !currentLocation.includes(`profile/` + user.username) ) ? <Share renderNewPost={renderNewPost} /> : null}
                    {posts.length < 1 ? <span className="nothingToSee">Nothing to see here</span> :
                    posts.map((p)=>(
                        <Post key={p._id} post={p} deletePost={deletePost} />
                    )) }
                <div className="endWrapper">
                    <span >End of feed</span>
                    <span className="toTop" onClick={scrollTop}>Top <ArrowUpward className="upArrow"/></span>
                </div>
            </div>
        </div>
    )
}
