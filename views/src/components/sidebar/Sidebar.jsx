import "./sidebar.css"
import { Adjust, Info, ReportProblem, Settings } from "@material-ui/icons"
import SidebarFriend from "../sidebarFriend/SidebarFriend"
import {AuthContext} from "../../context/AuthContext"
import { useContext, useState, useEffect, useRef } from 'react'
import axios from "axios";
import {Link } from "react-router-dom"
import Topbar from "../../components/topbar/Topbar"


export default function Sidebar() {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const {user:currentUser} = useContext(AuthContext)
    const [friends, setFriends] = useState([])
    const [showMore, setShowMore] = useState(false)
    let sidebarContainer = useRef()



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
        
        if(sidebarContainer.current.classList.contains("sidebarLoaded")){
            sidebarContainer.current.classList.remove('sidebarLoaded')
            sidebarContainer.current.classList.toggle('sidebarShowListContainer')

        }else{
            
            sidebarContainer.current.classList.toggle('sidebarListContainerHidden')
            sidebarContainer.current.classList.toggle('sidebarShowListContainer')
        }
        
        

    }


    //Check Location
    const currentLocation = window.location.pathname;
    
//return
    return (
        <div className="sidebar sidebarWidth">
            <div className="sidebarWrapper">
                <div className="topbarLeft">
                    <Link to="/" style={{textDecoration:"none"}}>
                        <span className="sidebarlogo"><img className="sidebarlogoImg" src={PF+"default/faamLarge.jpg"} alt="logoFaam"/></span>
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
                        
                            <div className="sidebarListContainer">
                                <h2 className="sidebarHeader" >More Projects</h2>
                                <div ref={sidebarContainer} className="sidebarLoaded">

                                <li className="sidebarListItem">
                                    <Adjust className="sidebarIcon" />
                                    <span className="sidebarListItemText"><a href="https://jewsonmusic.netlify.app/" rel="noreferrer" target="_blank" className="sidebarListItemText">My Music Portfolio</a></span>
                                </li>
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
                                </div>
                            </div>
                        {showMore ? ( 
                            <>
                            <div className="sidebarButtonContainer">

                                {/* <hr className="sidebarHr"/> */}
                                <button className="sidebarButton" onClick={clickShowMore}>Show Less</button>
                            </div>
                            </>
                        ) : (
                            <>
                            
                            <button className="sidebarButton sidebarShowMore" onClick={clickShowMore}>Show More</button>
                            </>
                            )}
                </ul>
                <hr className="sidebarHr"/>

                  {/* Friend List */}
                  <h3 className="sidebarFriendsHeader" >Your Friends</h3>
                    <ul className="sidebarFriendList">
                        {friends.map(u=>(
                            <SidebarFriend key={u._id} user={u}/>     
                        ))}
                    </ul>
                    <hr className="sidebarHr"/>       
            </div>
            <div className="sidebarlistItem sidebarAbout">
                <span className="sidebarListItemText">
                <Info className="sidebarIcon aboutIcon" />
                    <Link to="/about" className="sidebarListItemText">
                        <span className="sidebarListItemText">About This Site</span>
                    </Link>
                </span>
                <div className="sidebarListItemText sidebarSettingIcon">
                    <Link to={`/settings/${currentUser._id}`}>
                        <Settings className="settingsIcon"/> 
                    </Link>
                </div>
            </div>
        </div>
    )
}
