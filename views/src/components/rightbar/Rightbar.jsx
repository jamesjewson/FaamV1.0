import "./rightbar.css"
import { useContext, useEffect, useState } from "react"
import axios from "axios";
import {Link} from "react-router-dom"
import {AuthContext} from "../../context/AuthContext";
import {Add, Remove, HighlightOff, CameraAlt, CheckCircleOutline} from "@material-ui/icons"
import {Settings} from "@material-ui/icons"
import Online from "../online/Online"
import Topbar from "../topbar/Topbar"
import Share from "../share/Share"


import { Carousel } from 'react-responsive-carousel';

import "react-responsive-carousel/lib/styles/carousel.min.css";

import { useParams } from "react-router"



export default function Rightbar({user}) {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const {user:currentUser, dispatch} =  useContext(AuthContext)
    const [followed,setFollowed] = useState(false)
    const [photos, setPhotos] = useState([])
    const [viewImg, setViewImg] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [allUsers, setAllUsers] = useState([])

    const [profileImgFile,setProfileImgFile] = useState(null)
    const [isUser, setIsUser] = useState(false)
    const username = useParams().username 
     const [userImg, setUserImg] = useState({})

// Get current user followings
    useEffect(()=>{
        setFollowed(currentUser.following.includes(user?._id))
    },[currentUser, user])

// Get all users
    useEffect(() => {
       const getAllUsers = async ()=>{
           try{
               const userList = await axios.get("/users/allUsers")
               setAllUsers(userList.data)
            }catch(err){
               console.log(err)   
           }
       } 
       getAllUsers()      
    }, [])


//Get profile user Photos    
    useEffect(() => {
        const showPhotos = async ()=>{
                const res = await axios.get("/posts/photos/" + user?.username)
                setPhotos(res.data.sort((p1,p2)=>{
                    return new Date(p2.createdAt) - new Date(p1.createdAt);
                })
                )
        }
        showPhotos();
    }, [user?.username])
    
//Show/hide settings
    useEffect(() => {
        if(user?._id === currentUser?._id){
            setShowSettings(true)
        }                   
    }, [user, currentUser])
    


 //Handle follow click   
    const handleClick = async () =>{
        try{
            if(followed){
                await axios.put(`/users/${user._id}/unfollow`, {userId:currentUser._id})
                dispatch({type:"UNFOLLOW", payload:user._id})
            }else{
                await axios.put(`/users/${user._id}/follow`, {userId:currentUser._id})
                dispatch({type:"FOLLOW", payload:user._id})
            }
        }catch(err){
            console.log(err)
        }
        setFollowed(!followed)
    }

// Hide Carousel
    const hideLargeImage = (img)=>{
       setViewImg(false)
    }
    
    
 
    

///////////////////////////

useEffect(() =>{
    const fetchUser = async () => {      
    const res = await axios.get(`/users?username=${username}`)
    setUserImg(res.data);
}; 
   fetchUser();
},[username]);


//Show/hide Change pictures
useEffect(() => {
if(user?._id === currentUser?._id){
    setIsUser(true)
}                   
}, [user, currentUser])



    //Change Profile Pic
    const changeProfileImage = async (e)=>{
        e.preventDefault()
          //if user update profilepicimg
          if (!profileImgFile){
              alert("No file attached!")
          }else{
              const reader = new FileReader();
              reader.readAsDataURL(profileImgFile);
              reader.onloadend = () => {
                  uploadImage(reader.result);
              };
              reader.onerror = (error) => {
                  console.error(error);
              };
          }
      }
      const uploadImage = async (base64EncodedImage) => {
        const id = user._id
          const newProfilePic = {
              data: base64EncodedImage,
              id: user._id
          }
          try {
              const res = await axios.put("/users/"+ id + "/profilePicture", newProfilePic) 
              if(res.status === 200){
                  console.log("Profile Pic Updated")
                  const res = await axios.get(`/users?username=${username}`)
                  setUserImg(res.data);
                  setProfileImgFile('')
              }
          } catch (error) {
              console.log(error);
          }
      };


    










//////////////////////////////////////////////////////////////////////////


    //Home Right Bar
        const HomeRightBar = () => {
            return (
                <>
                    <div className="rightbarContainer">
                        <Topbar />
                        <hr className="rightbarHr" />
                        <h3 className="allUsersHeader" >People You Might Know</h3>
                        <div className="righbarAllUsersContainer">
                            {allUsers.map(user=>(
                                <Online key={user._id} user={user} />
                            ))}
                        </div>
                    </div>
                </>
            )
        }

    //Profile Right Bar
        const ProfileRightBar = () => {
           
            return (
            <>
            <div className="profileRightbarInfoContainer">
{/*  */}
                {/* Profile Pic Stuff */}
                {/* {!profileImgFile && ( */}
                <div className=" ">
                    {isUser ? (
                        <form onSubmit={changeProfileImage} className="newProfileImageForm">
                        
                                <label htmlFor="profileImgFile" className="" >
                                        {profileImgFile ? 
                                        
                                        <div className="profileUserImgDiv">
                                            <img src={URL.createObjectURL(profileImgFile)} alt="" className="profileUserImg" />
                                            <HighlightOff className="profilePicCancelImg" onClick={()=> setProfileImgFile(null)} />
                                        </div>
                                        
                                        : 
                                            <div className="profileUserImgDiv" > 
                                                <img 
                                                    className="profileUserImg" 
                                                    src={user.profilePicture ? user.profilePicture : PF + "person/noAvatar.jpeg"}  
                                                    alt=""
                                                    />                    
                                                <input 
                                                    style={{display:"none"}}
                                                    name="profileImgFile"
                                                    type="file" 
                                                    id="profileImgFile" 
                                                    accept=".png,.jpeg,.jpg" 
                                                    onChange={(e)=>{
                                                        try {
                                                            setProfileImgFile(e.target.files[0])
                                                            
                                                        } catch (error) {
                                                            console.log(error);
                                                        }
                                                    }} 
                                                    />
                                            </div>
                                        }
                                </label>
                            
                            {profileImgFile && (
                                <button className="saveProfileImgButton" type="submit"><CheckCircleOutline/></button>
                            )}
                        </form>  
                    ) : 
                    
                    (<img 
                        className="profileUserImg" 
                        src={user.profilePicture ? user.profilePicture : PF + "person/noAvatar.jpeg"}  
                        alt=""
                        /> )
                    
                    }

                {/* Profile Name */}
                <div className="profileInfo">
                    <h4 className="profileInfoName" >{user.username}</h4>
                    <span className="profileInfoDesc" >{user.desc}</span>
                </div>

                </div>
            {/* )}  */}
        
            {/* {profileImgFile && (
                <div className="profileUserImg">
                    <img src={URL.createObjectURL(profileImgFile)} alt="" className="profileUserImg" />
                    <HighlightOff className="profilePicCancelImg" onClick={()=> setProfileImgFile(null)} />
                </div>
            )} */}

                {/*  */}
                <hr className="allUserPhotosHrTop rightbarProfileHr" />
                
                {user.username !== currentUser.username && (
                    <button className="rightbarFollowButton" onClick={handleClick} >
                        {followed ? "Unfollow" : "Follow"}
                        {followed ? <Remove /> : <Add />}   
                    </button>
                )}

                <h4 className="rightbarTitle ">User Information</h4>   
                <div className="rightbarInfo">
                <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Name:</span>
                        <span className="rightbarInfoValue">{user.username}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City:</span>
                        <span className="rightbarInfoValue">{user.currentCity}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From:</span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship:</span>
                        <span className="rightbarInfoValue">{user.relationship }</span>
                    </div>
                </div>
                    {/* Share */}
                <Share />


                {/* User Photos */}
                <hr className="allUserPhotosHrTop" />
                <Link to={`/photoAlbum/${user.username}`} style={{textDecoration:"none"}} >
                    <h4 className="rightbarTitle">{user.username}'s Photos</h4>
                </Link>
                <div className="allUserPhotosContainer">
                    {photos.map((p)=>(
                        <img key={p._id} src={p.img} className="sidebarAllUserPhotos" alt={p?.desc} onClick={()=>{setViewImg(p)}} />
                    ))}
                </div>
                <hr className="allUserPhotosHrBottom" />

                {/* View Large Image */}
                { viewImg ? (
                    <>
                        {document.addEventListener('keydown', function(e){
                            if(e.key == 'Escape'){hideLargeImage();}
                        })}
                        <div className="largeImgContainer">
                            <HighlightOff onClick={hideLargeImage} className="hideLargeImg" />
                            {/* <img src={viewImg.img} className="viewLargeImage" alt={viewImg?.desc} /> */}
                            <div className="rightbarCarouselContainer">
                                <Carousel 
                                    infiniteLoop="true" 
                                    useKeyboardArrows="true" 
                                    showStatus="false"
                                    autoFocus="true"
                                    >
                                    {photos.map((p)=>(
                                        <img key={p._id} src={p.img} className="rightbarAllUserPhotosArray" alt={p?.desc} onClick={()=>{setViewImg(p)}} />
                                        ))}
                                </Carousel>
                            </div>

                        </div>
                    </>
                ) : null }
                { showSettings ? (
                <div className="settingsHeaderContainer">
                    <h3 className="settingsH3">
                        Settings 
                    </h3>  
                    <Link to={`/settings/${user._id}`}>
                        <Settings className="settingsIcon"/> 
                    </Link>   
                </div>
                ) : null
                }
            </div>
            </>
            )
        }


//Return
        return (
            <>          
            {user ? (
                
        <div className="rightbar profileRightbarMargin"  >
        <div className="rightbarWrapper">
            <ProfileRightBar />
        </div>
    </div>
            ): (
                <div className="rightbar"  >
                    <div className="rightbarWrapper">
                        <HomeRightBar />
                    </div>
                </div>)}</>

  
        )
}
