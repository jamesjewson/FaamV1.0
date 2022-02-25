import React from 'react'
// import { CameraAlt, CheckCircleOutline, HighlightOff } from "@material-ui/icons"
import { useEffect, useState } from 'react'
import axios from "axios"
import { useParams } from "react-router"
import "./profileTop.css"


import { Carousel } from 'react-responsive-carousel';

import "react-responsive-carousel/lib/styles/carousel.min.css";



export default function ProfileTop() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const username = useParams().username  
    const [user, setUser] = useState({})
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
