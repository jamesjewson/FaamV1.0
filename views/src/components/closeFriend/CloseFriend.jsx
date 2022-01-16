import "./closeFriend.css"
import {Link} from "react-router-dom"



export default function CloseFriend({user}) {
    return (
        <li className="sidebarFriend">
            <Link to={`/profile/${user.username}`}  style={{textDecoration:"none"}} className="sidebarFriend" >
                <img className="sidebarFriendImg" src={user.profilePicture} alt={user.username} />
                <span className="sidebarFriendName">{user.username}</span>
            </Link>
        </li>
    )
}
