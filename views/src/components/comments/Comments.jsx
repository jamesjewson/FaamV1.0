import "./comments.css"
import { useContext, useRef, useState, useEffect } from "react"
import {AuthContext} from "../../context/AuthContext"
import axios from "axios"
import CommentArray from "../commentArray/CommentArray"


export default function Comments(post) {

    const {user} = useContext(AuthContext)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const commentText = useRef()
    const [getComments, setGetComments] = useState([])
   

      //Fetch comments
      useEffect(() =>{
        const fetchComments = async () => {
            const res = await axios.get("/posts/comment/" + post._id, post._id)
            setGetComments(res.data);
            console.log(res.data);
        } 
        fetchComments();
    },[post._id])

    
    //Create a comment
    const submitHandler = async (e)=>{
        e.preventDefault()
        const createdAt = new Date()
        const commentId = user._id + post._id + Math.random()
        const newComment = {
            comment: commentText.current.value,
            parentPostId: post._id,
            createdAt: createdAt,
            user: user,
            commentId: commentId
        }
        if(newComment.comment){
            try{
              //  console.log(newComment)
              await axios.put("/posts/" + post._id + "/comment", newComment)
             setGetComments([...getComments, newComment])   
             commentText.current.value = ""
             console.log(newComment);

            }catch(err){
                console.log(err, "axios error")
            }
        }else{
            alert("You cannot leave a blank comment!")
        }
    }
    
    //Delete Comment
    const deleteComment = async (deletedComment) => {
        try {  
           const commentId = deletedComment.comment.commentId 
           const res = await axios.put("/posts/"+ commentId + "/deleteComment", deletedComment)
              console.log(res);
           setGetComments(getComments.filter((comment) => comment.commentId !== commentId))
        } catch (err) {
            console.log(err);
        }
    }



    //Edit Comment 
    const saveEditComment = async (updatedComment)=>{
        try {
            const commentId = updatedComment.comment.commentId
            await axios.put("/posts/" + commentId + "/updateComment", updatedComment)               
        } catch (error) {
            console.log(error);
        }
    }


///////Return Comments
    return (
        <div className="commentsWrapper">
            <div className="comments">
                <div className="shareWrapper">
                    <div className="shareTop">
                        <img src={user.profilePicture ? user.profilePicture : PF+"person/noAvatar.jpeg"} alt="" className="commentsProfileImg" />
                        <input placeholder={"Write your comment here"} className="commentsInput" ref={commentText}  />
                    </div>
                    <hr className="commentsHr" />
                     {/* Form */}
                    <form className="shareBottom" onSubmit={submitHandler} >
                            <button className="commentsButton" type="submit">Leave Comment</button>
                    </form>
                </div>
            </div>
            <div className="allComments">
               <span className="commentsTitle">- Comments -</span>
                 <div className="commentsArray">
                    <hr className="commentSectionHr"/>
                   
                    {getComments.map((comments)=>(
                        <CommentArray post={comments} deleteComment={deleteComment} saveEditComment={saveEditComment} />
                    ))}
                 </div>
            </div>
        </div>
    )
}
