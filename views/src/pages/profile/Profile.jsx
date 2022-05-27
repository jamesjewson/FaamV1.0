import "./profile.css"
import Sidebar from "../../components/sidebar/Sidebar"
import Rightbar from "../../components/rightbar/Rightbar"
import Feed from "../../components/feed/Feed"
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
        <div className="profile">
            <Sidebar className="profilePageSidebar" />
            <Feed username={username} />
            <Rightbar user={user} />
        </div>
        </>
    )
}
