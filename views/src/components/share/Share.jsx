import "./share.css"
import { PermMedia, Cancel } from "@material-ui/icons"
import { useContext, useRef, useState, useEffect } from "react"
import {AuthContext} from "../../context/AuthContext"
import axios from "axios"
import {Link} from "react-router-dom"


export default function Share({renderNewPost}) {

    const {user} = useContext(AuthContext)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const desc = useRef()
    const [file,setFile] = useState(null)
    const [currentUser, setCurrentUser] = useState(user)

        //Fetch user    
        useEffect(() =>{
            const fetchCurrentUser = async () => {
                const res = await axios.get(`/users/currentUser/` + user._id)
                setCurrentUser(res.data);
            };  
            fetchCurrentUser();
        },[user?._id]); 
        
    
    

    const submitHandler = async (e)=>{ 
        e.preventDefault()
        if (!file){
            textPost()
        }else{
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                uploadImage(reader.result);
            };
            reader.onerror = (error) => {
                console.error(error);
            };
        }
    }
    const uploadImage = async (base64EncodedImage) => {
        const newImgPost = {
            data: base64EncodedImage,
            userId: user._id,
            desc: desc.current.value
        }
        try { 
            const res = await axios.post("/posts/postImg", newImgPost) 
            console.log(res.data)
            setFile('')
            desc.current.value = ""
            renderNewPost(res.data)
        } catch (error) {
            console.log(error);
        }
    };
    const textPost = async (e) =>{
        const newPost =  {
            userId: user._id,
            desc: desc.current.value,
            likes: []
            }
            try {
                const res = await axios.post("/posts/textPost", newPost) 
                renderNewPost(res.data) 
                desc.current.value = ""
            } catch (error) {
                console.log(error);
            }
        }

    return (
        <div className="share">
           <div className="shareWrapper">
               <div className="shareTop">  
                    <Link to={`profile/${user.username}`}>
                       <img 
                            className="shareProfileImg" 
                            src={currentUser.profilePicture ? currentUser.profilePicture : PF+"person/noAvatar.jpeg"} 
                            alt="" 
                       />
                    </Link>
                   <input placeholder={"Hey "+user.username+"! What's important?"} className="shareInput" ref={desc} />
               </div>
               <hr className="shareHr" />
                {/* File upload */}
                {file && (
                    <div className="shareImgContainer">
                        <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
                        <Cancel className="shareCancelImg" onClick={()=> setFile(null)} />
                    </div>
                )}

               {/* Form */}
                <form className="shareBottom" onSubmit={submitHandler} >
                   <div className="shareOptions">
                       <label htmlFor="file" className="shareOption">
                           <PermMedia htmlColor="tomato" className="shareIcon"/>
                           <span className="shareOptionText">Photo/Video</span>
                           <input 
                                style={{display:"none"}} 
                                name="image"
                                type="file" 
                                id="file" 
                                accept=".png,.jpeg,.jpg" 
                                onChange={(e)=>setFile(e.target.files[0])} />
                        </label>
                   </div>
                   <button className="shareButton" type="submit">Share</button>
               </form>
           </div>
        </div>
    )
}
