import "./topbar.css"
import { Notifications } from "@material-ui/icons"
import {Link} from "react-router-dom"
import {useContext, useState, useEffect, useRef} from "react"
import {AuthContext} from "../../context/AuthContext"
import {logoutCall} from "../../apiCalls"
import axios from "axios"
import Notification from "../../components/notification/Notification"



export default function Topbar() {

    const {user, dispatch} = useContext(AuthContext)
    const [currentUser, setCurrentUser] = useState(user)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)
    let refNotifications = useRef()


//Fetch user    
useEffect(() =>{
    const fetchCurrentUser = async () => {
        const res = await axios.get(`/users/currentUser/` + user?._id)
        setCurrentUser(res.data);
    };  
    fetchCurrentUser();
},[user?._id]); 

//Fetch user notifications
    useEffect(() => {
        const fetchUserNotifications = async()=>{
            let resMessage = await axios.get(`/users/notifications/` + user?._id)
            resMessage = resMessage.data
            setNotifications(resMessage)
        }
        fetchUserNotifications()
    }, [user?._id])

    // Handle click outside of notifications
    useEffect(() => {
        document.addEventListener("click", handleNotificationOutsideClick)
        return () => {
            document.removeEventListener("click", handleNotificationOutsideClick)
        }
    }, [])

    //Handle notification outside click
    const handleNotificationOutsideClick = (e)=>{
        if(!refNotifications.current?.contains(e.target)){
            setShowNotifications(false)
        }
    }

    const clickShowNotifications = ()=>{
        showNotifications ? setShowNotifications(false) : setShowNotifications(true)
    }

    const deleteNotification = async (deletedNotification)=>{
         try {     
            await axios.delete("/posts/"+ deletedNotification + "/deleteNotification",    { data: {deletedNotification}}
            )
             setNotifications(notifications.filter((notification) => notification._id !== deletedNotification))
         } catch (err) {
             console.log(err);
         }
    }


    //Logout    
    function handleLogout(e){
        e.preventDefault();
        logoutCall({user:null}, dispatch)      
    }


////////Return
    return (
        <div className="topbarContainer">
            <div className="topbarRight" ref={refNotifications}>
                <Link to={`/profile/${user.username}`} >
                    <img src={ currentUser.profilePicture ? currentUser.profilePicture : PF+"person/noAvatar.jpeg"} alt="Jimmy" className="topbarImg" />
                </Link>
                <div className="topbarLinks">
                    <Link to={`/profile/${user.username}`} style={{textDecoration:"none"}} className="topbarLink" >
                        <span className="topbarLink2">Homepage</span>
                    </ Link>
                    <Link to="/" style={{textDecoration:"none"}} className="topbarLink topbarLinkBottom" >
                        <span className="topbarLink2">Timeline</span>
                    </Link>
                </div>
                
                <div className="topbarIcons" >
                    <div className="topbarIconItem" >
                        <Notifications onClick={clickShowNotifications} />
                        {(notifications?.length > 0) ? (
                            <span className="topbarIconBadge" onClick={clickShowNotifications} >{notifications.length}</span>   
                        ) : null }
                    </div>
                    <div className="notificationContainer" >
                    {showNotifications? (
                            notifications.map((notification)=>(
                                <Notification key={notification.id} notification={notification} deleteNotification={deleteNotification} /> 
                                ))
                                ) : null }
                    </div>
                </div>

                <div className="logout">
                    <button id="logoutButton" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}
