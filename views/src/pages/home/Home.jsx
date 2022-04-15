import React from 'react'
import Sidebar from "../../components/sidebar/Sidebar"
import Rightbar from "../../components/rightbar/Rightbar"
import Feed from "../../components/feed/Feed"
import "./home.css"


export default function Home() {
    return (
        <>
           <div className="homeContainer">
                <Sidebar className="homeSidebar" />
                <Feed />
                <Rightbar />
           </div>  
        </>
    )
}
