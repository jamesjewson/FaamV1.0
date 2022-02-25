import "./sidebar.css"
import { Adjust, Info, ReportProblem } from "@material-ui/icons"
import CloseFriend from "../closeFriend/CloseFriend"
import {AuthContext} from "../../context/AuthContext"
import { useContext, useState, useEffect } from 'react'
import axios from "axios";
import {Link } from "react-router-dom"
import Topbar from "../../components/topbar/Topbar"


export default function Sidebar() {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const {user:currentUser} = useContext(AuthContext)
    const [friends, setFriends] = useState([])
    const [showMore, setShowMore] = useState(false)

    //Fetch user    
    useEffect(() =>{
        const fetchFriends = async () => {
            const res = await axios.get(`/users/friends/` + currentUser._id)
            setFriends(res.data);
        };  
        fetchFriends();
    },[currentUser?._id]); 
    
    const clickShowMore = ()=>{
        showMore ? setShowMore(false) : setShowMore(true)
    }


    //Check Location
    const currentLocation = window.location.pathname;
    
//return
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="topbarLeft">
                    <Link to="/" style={{textDecoration:"none"}}>
                        <span className="sidebarlogo"><img className="sidebarlogoImg" src={PF+"default/faamLarge.png"} alt="logo"/></span>
                    </Link>
                </div>
                <hr className="sidebarHr"/>
                {
                (currentLocation.includes("profile") || currentLocation.includes("photoAlbum") || currentLocation.includes("settings")) ? (
                    <div className="sidebarTopbarProfile">
                        <Topbar className="profileSidebarTopbar"/>
                        <hr className="sidebarHr"/>
                 </div>)
                 : null
                }
                {/* Sidebar Clickables */}
                <ul className="sidebarList">
                        
                        {showMore ? ( 
                            <>
                                <h2 className="sidebarHeader" >More Projects</h2>
                                <li className="sidebarListItem">
                                    <Adjust className="sidebarIcon" />
                                    <span className="sidebarListItemText"><a href="https://todolistjewson.herokuapp.com/" rel="noreferrer" target="_blank" className="sidebarListItemText">To Do List App</a></span>
                                </li>
                                <li className="sidebarListItem">
                                    <ReportProblem className="sidebarIcon" />
                                    <span className="sidebarListItemText"><a href="https://jamesjewson.netlify.app/#contact" rel="noreferrer" target="_blank" className="sidebarListItemText">Report a bug</a></span>
                                </li>
                                <li className="sidebarListItem">
                                    <Info className="sidebarIcon" />
                                    <span className="sidebarListItemText"><a href="https://jamesjewson.netlify.app/#" rel="noreferrer" target="_blank" className="sidebarListItemText">About This Developer</a></span>
                                </li>
                                <hr className="sidebarHr"/>
    
                                <button className="sidebarButton" onClick={clickShowMore}>Show Less</button>
                            </>
                        ) : (
                            
                            <button className="sidebarButton" onClick={clickShowMore}>Show More</button>
                            )}
                </ul>
                <hr className="sidebarHr"/>

                  {/* Friend List */}
                  <h3 className="sidebarFriendsHeader" >Your Friends</h3>
                    <ul className="sidebarFriendList">
                        {friends.map(u=>(
                            <CloseFriend key={u._id} user={u}/>     
                        ))}
                    </ul>
                    <hr className="sidebarHr"/>       
            </div>
            <div className="sidebarlistItem sidebarAbout">
                <Info className="sidebarIcon aboutIcon" />
                <span className="sidebarListItemText">
                    <Link to="/about" class="sidebarListItemText">
                        <span className="sidebarListItemText">About This Site</span>
                    </Link>
                </span>
            </div>
        </div>
    )
}
