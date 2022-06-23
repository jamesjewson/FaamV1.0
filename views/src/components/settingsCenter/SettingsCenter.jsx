import React from 'react'
import "./settingsCenter.css"
import { useContext, useState, useEffect } from "react"
import {AuthContext} from "../../context/AuthContext"
import axios from "axios"
import {Edit} from "@material-ui/icons"
import {Link} from "react-router-dom"
import {logoutCall} from "../../apiCalls"
import Topbar from "../../components/topbar/Topbar"


export default function SettingsCenter() {
    const {user, dispatch} = useContext(AuthContext)
    const username = user.username
    const [currentUser, setCurrentUser] = useState({})
    const [fromInputState, setFromInputState] = useState(false)
    const [usernameInputState, setUsernameInputState] = useState(false)
    const [currentCityInputState, setCurrentCityInputState] = useState(false)
    const [emailInputState, setEmailInputState] = useState(false)
    const [relationshipInputState, setRelationshipInputState] = useState(false)
    const [showHideSettings, setShowHideSettings] = useState(false)
    const [profileImgFile,setProfileImgFile] = useState(null)
    const [isUser, setIsUser] = useState(false)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;


    useEffect(() =>{
        const fetchUser = async () => {      
        const res = await axios.get(`/users?username=${username}`)
        setCurrentUser(res.data);
    }; 
       fetchUser();
    },[username]);


//Submit User Setting Changes
    const submitChanges = async (e)=>{
        e.preventDefault();
        try {
            let updatedEmail = emailInputState
            let updatedFrom  = fromInputState
            let updatedUsername  = usernameInputState
            let updatedCurrentCity  = currentCityInputState
            let updatedRelationship = relationshipInputState

            //Check if email actually changed
            if( (updatedEmail !== false) && (updatedEmail !== user.email) && (updatedEmail !== "")){
            }else{
                updatedEmail = user.email
            }
            if( (updatedFrom !== false) && (updatedFrom !== user.from) && (updatedFrom !== "")){
            }else{
                updatedFrom = user.from
            }
            if( (updatedUsername !== false) && (updatedUsername !== user.username) && (updatedUsername !== "")){
            }else{
                updatedUsername = user.username
            }
            if( (updatedCurrentCity !== false) && (updatedCurrentCity !== user.currentCity)  && (updatedCurrentCity !== "")){
            }else{
                updatedCurrentCity = user.currentCity
            }
            if( (updatedRelationship !== false) && (updatedRelationship !== user.relationship)  && (updatedRelationship !== "")){
            }else{
                updatedRelationship = user.relationship
            }

            const updatedUserSettings = {
                userId: user._id,
                email: updatedEmail,
                from: updatedFrom,
                username: updatedUsername,
                currentCity: updatedCurrentCity,
                relationship: updatedRelationship

            }

            try {
                const res = await axios.put("/users/"+ user._id, updatedUserSettings) 
                setCurrentUser(updatedUserSettings)
                console.log(res.status)
                if(res.status === 200){
                    setShowHideSettings(false)
                }
            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    //ShowHide Change Settings
    const showHideClick = ()=>{
        if(currentUser.username !== 'Demo'){            
            setShowHideSettings(!showHideSettings)
            setFromInputState(currentUser.from)
            setUsernameInputState(currentUser.username)
            setCurrentCityInputState(currentUser.currentCity)
            setEmailInputState(currentUser.email)
            setRelationshipInputState(currentUser.relationship)
        }
        else{
            alert("Setting modifications have been disabled for the demo. Create your own profile if you wish to use this feature.")
        }
    }

//Show/hide Change pictures
useEffect(() => {
    if(user?._id === currentUser?._id){
        setIsUser(true)
    }                   
    }, [user, currentUser])
    


  //Change Profile Pic
  const changeProfileImage = async (e)=>{
    e.preventDefault()
      if (!profileImgFile){
          alert("No file attached!")
      }else{
          const reader = new FileReader();
          reader.readAsDataURL(profileImgFile);
          reader.onloadend = () => {
              uploadImage(reader.result);
          };
          reader.onerror = (error) => {
              console.error(error);
          };
      }
  }
  const uploadImage = async (base64EncodedImage) => {
    const id = user._id
      const newProfilePic = {
          data: base64EncodedImage,
          id: user._id
      }
      try {
          const res = await axios.put("/users/"+ id + "/profilePicture", newProfilePic) 
          if(res.status === 200){
              setProfileImgFile('')
          }
      } catch (error) {
          console.log(error);
      }
  };

//Delete Profile
  const deletePopup = ()=> { 
    try {
        if(user.username === "demo"){
            alert("You cannot delete the demo! Make your own profile if you wish to test this!")
        }
        else if (isUser) {
            if(window.confirm("Delete your profile? (This cannot be undone.)") === true){
                deleteProfile()
            }   
        }
    }
    catch(err){
        console.log(err);
    }
  }

  const deleteProfile = async ()=>{
    try {
        const res = await axios.delete("/users/" + user._id, { data: {user}})
        if(res.status === 200){
            alert("Account Deleted! Come back soon! There'll be a page saying goodbye someday :(")
            logoutCall({user:null}, dispatch)
        }
    } catch (error) {
        console.log(error);
    }
  }

////////////////    

    return (
        <>    
        <div className="settingsCenter">
            <div className="middleSettings">
                <section className="settingsTopbar">
                    <h1 className="settingsPageH1">Settings for {user.username} <Edit onClick={showHideClick} className="editSettingsIcon"/></h1>
                    <Link  to={`/profile/${user.username}`} className="settingsGoBack" >
                        <span className="settingsGoBack" >Go Back</span>
                    </Link>
                    <hr className="settingsHr"/>
                </section>
                    
                <div className="formDanger">
                    <form onSubmit={submitChanges} className="updateProfileSettingsForm">
                        <div className="settingsUserInfoContainer">
                            <span className="settingsLabel">Username: </span>
                            {showHideSettings ? (
                                <>
                                    <input type="text" placeholder="Update username here" className="settingsInput" value={usernameInputState} />
                                    {/* <input type="text" placeholder="Update username here" className="settingsInput" value={usernameInputState} onChange={(e)=> setUsernameInputState(e.target.value)} /> */}
                                </>
                                ) : (
                                    <span className="settingsCurrentValue">{currentUser.username}</span>    
                                    ) }

                        </div>
                        <div className="settingsUserInfoContainer">
                            <span className="settingsLabel">From: </span>
                            {showHideSettings ? 
                            (
                                <input type="text" placeholder="Update where you're from here" className="settingsInput" value={fromInputState}  onChange={(e)=> setFromInputState(e.target.value)} />
                                ) : (
                                    <span className="settingsCurrentValue">{currentUser.from} </span>
                                    )}
                        </div>

                        <div className="settingsUserInfoContainer">
                        <span className="settingsLabel">Current City: </span>
                        {showHideSettings ? (
                            <input type="text" placeholder="Update your current city here" className="settingsInput" value={currentCityInputState}  onChange={(e)=> setCurrentCityInputState(e.target.value)} />
                            
                            ) : (
                                <span className="settingsCurrentValue">{currentUser.currentCity} </span>
                                ) }
                        </div>

                        <div className="settingsUserInfoContainer">
                        <span className="settingsLabel">Email: </span>
                        {showHideSettings ? (
                            <>
                                    <input type="text" placeholder="Update your email here" className="settingsInput" value={emailInputState} readonly/>
                                    <span className="readonlyInput"> For demo purposes, this input is read only.</span>
                            </>
                            ) : (
                                <span className="settingsCurrentValue">{currentUser.email} </span>
                                ) }
                        </div>

                        <div className="settingsUserInfoContainer">
                        <span className="settingsLabel">Relationship Status: </span>
                        {showHideSettings ? (
                            <input type="text" placeholder="Update your relationship here" className="settingsInput" value={relationshipInputState}  onChange={(e)=> setRelationshipInputState(e.target.value)} />
                            ) : (
                                <span className="settingsCurrentValue">{currentUser.relationship} </span>
                                ) }
                        </div>
                        {showHideSettings ? (
                            <>
                            <button type="submit" className="settingsButton">Save</button>
                            <button type="button" onClick={showHideClick} className="settingsButton">Cancel</button>
                            </>
                        ) : null}
                    </form>
                    <div className="dangerZone">
                        <div className="settingsUserInfoContainer danger">
                            <span className="settingsLabel deleteProfile">!DANGER ZONE!</span>
                            <button className="settingsLabel deleteProfile" onClick={deletePopup} >DELETE PROFILE</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div className="settingsRightbar">
                {/* Profile Pic Stuff */}
                    {/* All CSS is in the file rightbar.css unless has prefix of settings */}
                    <div className=" ">
                        <div className="settingsMobileTopbar">
                            <Topbar />
                        </div>
                    {isUser ? (
                        <form onSubmit={changeProfileImage} className="newProfileImageForm">
                            <label htmlFor="profileImgFile" className="" >
                                {profileImgFile ? 
                                    <div className="profileUserImgDiv">
                                        <img src={URL.createObjectURL(profileImgFile)} alt="" className="profileUserImg settingsProfileUserImg" />
                                        <div className="saveNewImgContainer">
                                            <span className="">Keep this as your profile picture? <button className="saveProfileImgButton" type="submit">yes</button>  <button className="saveProfileImgButton" onClick={()=> setProfileImgFile(null)}>no</button>  </span>            
                                        </div>
                                    </div>
                                : 
                                    <div className="profileUserImgDiv " > 
                                        <img 
                                            className="profileUserImg settingsProfileUserImg" 
                                            src={user.profilePicture ? user.profilePicture : PF + "person/noAvatar.jpeg"}  
                                            alt=""
                                            />                    
                                        <input 
                                            style={{display:"none"}}
                                            name="profileImgFile"
                                            type="file" 
                                            id="profileImgFile" 
                                            accept=".png,.jpeg,.jpg" 
                                            onChange={(e)=>{
                                                try {
                                                    setProfileImgFile(e.target.files[0])
                                                    
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            }} 
                                        />
                                    </div>
                                }
                            </label>
                        </form>  
                    ) :  (
                        <img 
                            className="profileUserImg" 
                            src={user.profilePicture ? user.profilePicture : PF + "person/noAvatar.jpeg"}  
                            alt=""
                        /> )
                    }
                    {/* Profile Name */}
                    <div className="profileInfo">
                        <h4 className="settingsProfileInfoName" >{user.username}</h4>
                    </div>

                    <hr className="allUserPhotosHrTop rightbarProfileHr settingsCenterHr" />

                    <h4 className="rightbarTitle ">User Information</h4>   
                <div className="rightbarInfo">
                <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Name:</span>
                        <span className="rightbarInfoValue">{user.username}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City:</span>
                        <span className="rightbarInfoValue">{user.currentCity}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From:</span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship:</span>
                        <span className="rightbarInfoValue">{user.relationship }</span>
                    </div>
                </div>
                <hr className="allUserPhotosHrTop" />
            </div>
        </div>   
        </>
    )
}
