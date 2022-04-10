import "./mightKnow.css"
import {Link} from "react-router-dom"

export default function MightKnow({user}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <li className="mightKnowFriend">
            <Link to={`/profile/${user.username}`} className="mightKnowFriend">
                <div className="mightKnowImgContainer">
                    <img src={user.profilePicture ? user.profilePicture : PF+"person/noAvatar.jpeg"} alt="" className="mightKnowProfileImg" />
                    <span className="mightKnowOnline"></span>
                </div>
                <span className="mightKnowUsername">{user.username}</span>
            </Link>
        </li>
    )
}
