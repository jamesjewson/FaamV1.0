import React from 'react'
import "./notification.css"
import { Cancel } from "@material-ui/icons"


export default function Notification(notification) {
    
    const deleteNotification = ()=>{
        const deletedNotification = notification
        notification.deleteNotification(deletedNotification)
    }


    return (
        <>
            <div className="notificationsContainer">
                <img src={notification?.notification.follower.profilePicture} alt="" className="notificationImg" />
                <span>{notification?.notification.message}</span>
                <span className="notificationDelete" onClick={deleteNotification}><Cancel /></span>
                <hr className="notificationHr" />
            </div>
        </>
    )
}
