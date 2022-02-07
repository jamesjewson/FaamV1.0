import "./profile.css"
import Topbar from "../../components/topbar/Topbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Rightbar from "../../components/rightbar/Rightbar"
import Feed from "../../components/feed/Feed"
import ProfileTop from "../../components/profileTop/ProfileTop"
import { useEffect, useState } from 'react'
import axios from "axios"
import { useParams } from "react-router"
 


export default function Profile() {
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
        <div className="profile">
            <Sidebar />
            <div className="profileRight">
                <div className="profileRightTop">
                    <ProfileTop />                
                </div>
                <div className="profileRightBottom">
                    <Feed username={username} />
                    <Rightbar user={user} />
                </div>
            </div>      
        </div>
        </>
    )
}
