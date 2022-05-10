import React from 'react'
import "./notification.css"
import { Cancel } from "@material-ui/icons"
import {useContext, useState, useEffect, useRef} from "react"
import axios from "axios"


export default function Notification(notification) {
    
    const deleteNotification = ()=>{
        const deletedNotification = notification.notification._id
        // console.log(deletedNotification);
        notification.deleteNotification(deletedNotification)
    }

    
    //Get profile picture
    //Fetch user notifications
    // useEffect(() => {
    //     // console.log(notification);
        
    // }, [])

    //Get name


    return (
        <>
            <div className="notificationsContainer">
                <img src={notification?.notification.senderPic} alt="" className="notificationImg" />
                <span>{notification?.notification.message}</span>
                <span className="notificationDelete" onClick={deleteNotification}><Cancel /></span>
                <hr className="notificationHr" />
            </div>
        </>
    )
}
