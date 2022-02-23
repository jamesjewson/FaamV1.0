import React from 'react'
// import { CameraAlt, CheckCircleOutline, HighlightOff } from "@material-ui/icons"
import { useEffect, useState, useContext } from 'react'
import axios from "axios"
import { useParams } from "react-router"
import "./profileTop.css"
import {AuthContext} from "../../context/AuthContext";


import { Carousel } from 'react-responsive-carousel';

import "react-responsive-carousel/lib/styles/carousel.min.css";



export default function ProfileTop() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const username = useParams().username  
    const [profileImgFile,setProfileImgFile] = useState(null)
    const [coverImgFile,setCoverImgFile] = useState(null)
    const [user, setUser] = useState({})
    const [isUser, setIsUser] = useState(false)
    const {user:currentUser} =  useContext(AuthContext)
    const [userPhotos, setUserPhotos] = useState([])

    //Get profile user Photos    
    useEffect(() => {
        const showPhotos = async ()=>{
                const res = await axios.get("/posts/photos/" + user?.username)
                setUserPhotos(res.data)
        }
        showPhotos();
    }, [user?.username])

 
    useEffect(() =>{
        const fetchUser = async () => {      
        const res = await axios.get(`/users?username=${username}`)
        setUser(res.data);
    }; 
       fetchUser();
    },[username]);


//Show/hide Change pictures
useEffect(() => {
    if(user?._id === currentUser?._id){
        setIsUser(true)
    }                   
}, [user, currentUser])




    // //Change Profile Pic
    // const changeProfileImage = async (e)=>{
    //     e.preventDefault()
    //       //if user update profilepicimg
    //       if (!profileImgFile){
    //           alert("No file attached!")
    //       }else{
    //           const reader = new FileReader();
    //           reader.readAsDataURL(profileImgFile);
    //           reader.onloadend = () => {
    //               uploadImage(reader.result);
    //           };
    //           reader.onerror = (error) => {
    //               console.error(error);
    //           };
    //       }
    //   }
    //   const uploadImage = async (base64EncodedImage) => {
    //     const id = user._id
    //       const newProfilePic = {
    //           data: base64EncodedImage,
    //           id: user._id
    //       }
    //       try {
    //           const res = await axios.put("/users/"+ id + "/profilePicture", newProfilePic) 
    //           if(res.status === 200){
    //               console.log("Profile Pic Updated")
    //               const res = await axios.get(`/users?username=${username}`)
    //               setUser(res.data);
    //               setProfileImgFile('')
    //           }
    //       } catch (error) {
    //           console.log(error);
    //       }
    //   };


//Change Cover Pic
    // const changeCoverImage = async (e)=>{
    //     e.preventDefault()
    //       if (!coverImgFile){
    //           console.log("no file")
    //       }else{
    //           const reader = new FileReader();
    //           reader.readAsDataURL(coverImgFile);
    //           reader.onloadend = () => {
    //               uploadCoverImage(reader.result);
    //           };
    //           reader.onerror = (error) => {
    //               console.error(error);
    //           };
    //       }
    //   }


    //   const uploadCoverImage = async (base64EncodedImage) => {
    //     const id = user._id
    //       const newCoverPic = {
    //           data: base64EncodedImage,
    //           id: user._id
    //       }
    //       try {
    //           const res = await axios.put("/users/"+ id + "/coverPicture", newCoverPic) 
    //           if(res.status === 200){
    //               console.log("Cover Pic Updated")
    //               const res = await axios.get(`/users?username=${username}`)
    //               setUser(res.data);
    //               setCoverImgFile('')
    //           }
    //       } catch (error) {
    //           console.log(error);
    //       }
    //   };





//Return
    return (
        <>
          <div className="profileTopWrapper">
                <div className="profileCover">
                
                {/* Background Images */}
                {userPhotos.length > 0 ? (
                                      <Carousel className="profileBackgroundCarousel"
                                      infiniteLoop="true" 
                                      useKeyboardArrows="true" 
                                      autoFocus="true" 
                                      showStatus="false"
                                      autoPlay="true"
                                      showThumbs="false"
                                      >
                                      {userPhotos.map((p)=>(
                                          <img key={p._id} src={p.img} className="profileBackgroundImages" alt={p?.desc}  />
                                      ))}
                                  </Carousel>
                ) : null}
  
                    </div>
                    
          </div>
                  
        </>
    )
}
