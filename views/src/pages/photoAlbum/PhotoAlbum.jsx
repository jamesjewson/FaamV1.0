import Topbar from "../../components/topbar/Topbar"
import Rightbar from "../../components/rightbar/Rightbar"
import Sidebar from "../../components/sidebar/Sidebar"
import PhotoAlbumFeed from "../../components/photoAlbumFeed/PhotoAlbumFeed"
import axios from "axios"
import { useEffect, useState } from 'react'
import "./photoAlbum.css"
import { useParams } from "react-router"


export default function PhotoAlbum() {

    const [user, setUser] = useState({})
    const username = useParams().username

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
            <Topbar/>
            <div className="photoAlbumContainer">
                <Sidebar />
                <div className="photoAlbum">
                    <h2 className="photoAlbumHeader ">{user?.username}'s Photos</h2>
                    <hr className="photoAlbumHr" />
                    <PhotoAlbumFeed user={user} />
                </div>
                <Rightbar className="rightbarPhotoAlbum"/>
            </div>
        </>
    )
}
