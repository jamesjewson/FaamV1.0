import React from 'react'
import { HighlightOff} from "@material-ui/icons"
import axios from "axios"
import { useEffect, useState, useRef } from 'react'
import "./photoAlbumFeed.css"


import { Carousel } from 'react-responsive-carousel';

import "react-responsive-carousel/lib/styles/carousel.min.css";




export default function PhotoAlbumFeed({user}) {

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
     
    // View large carousel image
    const viewLargeCarousel = (img)=>{
        console.log(userPhotos[img]);
        setViewImg(userPhotos[img])
    }



        

    //Return
    return (
        <>
            <div className="photoArrayContainer">
                {/* <div className="swiper">

                </div> */}
                <Carousel infiniteLoop="true" useKeyboardArrows="true">
                {userPhotos.map((p)=>(
                        <img key={p._id} src={p.img} className="allUserPhotosArray" alt={p?.desc} onClick={()=>{setViewImg(p)}} />
                        ))}
             

                </Carousel>
                    
           
                 {/* <TestSwiper photos={userPhotos} /> */}



            </div>
            
            

        {/* View Large Image */}
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
