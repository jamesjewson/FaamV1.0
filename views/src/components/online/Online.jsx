import "./online.css"
import {Link} from "react-router-dom"

export default function Online({user}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <li className="rightbarFriend">
            <Link to={`/profile/${user.username}`} className="rightbarFriend">
                <div className="rightbarProfileImgContainer">
                    <img src={user.profilePicture ? user.profilePicture : PF+"person/noAvatar.jpeg"} alt="" className="rightbarProfileImg" />
                    <span className="rightbarOnline"></span>
                </div>
                <span className="rightbarUsername">{user.username}</span>
            </Link>
        </li>
    )
}
