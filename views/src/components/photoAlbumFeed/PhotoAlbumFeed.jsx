import React from 'react'
import { HighlightOff, Delete} from "@material-ui/icons"
import axios from "axios"
import { useEffect, useState, useContext } from 'react'
import "./photoAlbumFeed.css"
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {AuthContext} from "../../context/AuthContext";


export default function PhotoAlbumFeed({user}) {
    const {user:currentUser} =  useContext(AuthContext)
    const [userPhotos, setUserPhotos] = useState([])
    const [viewImg, setViewImg] = useState(false)

    //Get profile user Photos    
    useEffect(() => {
        const showPhotos = async ()=>{
                const res = await axios.get("/posts/photos/" + user?.username)
                setUserPhotos(res.data)
        }
        showPhotos();
    }, [user?.username])


    // Hide large photo
    const hideLargeImage = (img)=>{
        setViewImg(false)
    }
     
    const deleteImagePopup = (image)=>{
        if(currentUser._id === image.userId){
            if(image.isProfilePic === false){
                if(window.confirm("Delete this image and any connected post? (This cannot be undone.)") === true){
                    deleteImage(image)  
                }
            }else{
                alert("You cannot delete your current profile picture.")
            }
        }else{
            alert("You cannot delete someone else's photos. (This icon will be removed in a future update)")
        }   
    }


    const deleteImage = async (image)=>{
        alert("image deleted")
        try {
            await axios.delete("/posts/deleteImagePost/"+image.postId, { data: {image}})
            setUserPhotos(userPhotos.filter((photo) => photo._id !== image._id))
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="photoArrayContainer">

                {userPhotos.length > 0 ? (
                    <Carousel infiniteLoop="false" 
                    useKeyboardArrows="true" 
                    autoFocus="true" 
                    showStatus="false"
                    autoPlay="false"
                    interval="9999999999999"
                    >
                        {userPhotos.map((p)=>(
                            <div className="photoAlbumFeedPhotoContainer">
                                <img key={p._id} src={p.img} className="allUserPhotosArray" alt={p?.desc} onClick={()=>{setViewImg(p)}} />
                                <Delete className="deleteImgIcon" onClick={()=>{deleteImagePopup(p)}} />    
                            </div>
                        ))}
                    </Carousel> )
                : null }    
            </div>
        {/* View Large Image- CSS in public/css/popupImg.css */}
            { viewImg ? (
                <>
                    <div className="largeImgContainer">
                        <HighlightOff onClick={hideLargeImage} className="hideLargeImg" />
                        <img src={viewImg.img} className="viewLargeImage" alt={viewImg?.desc} />
                    </div>     
                </>
            ) : null }
        </>
    )
}
