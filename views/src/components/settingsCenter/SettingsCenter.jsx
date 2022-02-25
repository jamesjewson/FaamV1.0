import React from 'react'
import "./settingsCenter.css"
import { useContext, useState, useEffect } from "react"
import {AuthContext} from "../../context/AuthContext"
import axios from "axios"
import {Edit} from "@material-ui/icons"
import {Link} from "react-router-dom"


export default function SettingsCenter() {
    const {user} = useContext(AuthContext)
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
                console.log("email updated")
            }else{
                console.log("email not updated");
                updatedEmail = user.email
            }
            //Check if from actually changed
            if( (updatedFrom !== false) && (updatedFrom !== user.from) && (updatedFrom !== "")){
                console.log("from updated")
            }else{
                console.log("from not updated");
                updatedFrom = user.from
            }
            //Check if username actually changed
            if( (updatedUsername !== false) && (updatedUsername !== user.username) && (updatedUsername !== "")){
                console.log("username updated")
            }else{
                console.log("username not updated");
                updatedUsername = user.username
            }
            //Check if current city actually changed
            if( (updatedCurrentCity !== false) && (updatedCurrentCity !== user.currentCity)  && (updatedCurrentCity !== "")){
                console.log("current city updated")
            }else{
                console.log("current city not updated");
                updatedCurrentCity = user.currentCity
            }

            //Check if relationship actually changed
            if( (updatedRelationship !== false) && (updatedRelationship !== user.relationship)  && (updatedRelationship !== "")){
                console.log("relationship updated")
            }else{
                console.log("relationship not updated");
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
        if(currentUser.username == 'Demo'){

            
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

    
/////////////////



//Show/hide Change pictures
useEffect(() => {
    if(user?._id === currentUser?._id){
        setIsUser(true)
    }                   
    }, [user, currentUser])
    



  //Change Profile Pic
  const changeProfileImage = async (e)=>{
    e.preventDefault()
      //if user update profilepicimg
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
              console.log("Profile Pic Updated")
              const res = await axios.get(`/users?username=${username}`)
            //   setUserImg(res.data);
              setProfileImgFile('')
          }
      } catch (error) {
          console.log(error);
      }
  };




////////////////    

    return (
        <>
            
        <div className="settingsCenter">
            <div className="middleSettings">

            <h1 className="settingsPageH1">Settings for {user.username} <Edit onClick={showHideClick} className="editSettingsIcon"/></h1>
            <Link  to={`/profile/${user.username}`} className="settingsGoBack" >
                <span className="settingsGoBack" >Go Back</span>
            </Link>
            <hr className="settingsHr"/>
            <form onSubmit={submitChanges} className="updateProfileSettingsForm">
               <div className="settingsUserInfoContainer">
                    <span className="settingsLabel">Username: </span>
                    {showHideSettings ? (
                        <>
                        {/* <input type="text" placeholder="Update username here" className="settingsInput" value={usernameInputState} onChange={(e)=> setUsernameInputState(e.target.value)} /> */}
                        <input type="text" placeholder="Update username here" className="settingsInput" value={usernameInputState}/>
                        {/* <span className="readonlyInput"> For demo purposes, this input is read only.</span> */}
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
                       //    <input type="text" placeholder="Update your email here" className="settingsInput" value={emailInputState} readonly  onChange={(e)=> setEmailInputState(e.target.value)} />
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
                    <button type="submit" >Save</button>
                    <button type="button" onClick={showHideClick}>Cancel</button>
                    </>
                ) : null}
           </form>
            </div>
            <div className="settingsRightbar">
                {/* Profile Pic Stuff */}
                    {/* All CSS is in the file rightbar.css unless has prefix of settings */}
                    <div className=" ">
                    {isUser ? (
                        <form onSubmit={changeProfileImage} className="newProfileImageForm">
        
                                <label htmlFor="profileImgFile" className="" >
                                        {profileImgFile ? 
                                        
                                        <div className="profileUserImgDiv">
                                            <img src={URL.createObjectURL(profileImgFile)} alt="" className="profileUserImg settingsProfileUserImg" />
                                            <div className="saveNewImgContainer">

                                                <span className="">Keep this as your profile picture? <button className="saveProfileImgButton" type="submit">yes</button>  <button className="saveProfileImgButton" onClick={()=> setProfileImgFile(null)}>no</button>  </span>            
                                            </div>
                                            {/* <HighlightOff className="profilePicCancelImg" onClick={()=> setProfileImgFile(null)} /> */}
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
{/*                             
                            {profileImgFile && (
                                <button className="saveProfileImgButton" type="submit"><CheckCircleOutline/></button>
                            )} */}
                        </form>  
                    ) : 
                    
                    (<img 
                        className="profileUserImg" 
                        src={user.profilePicture ? user.profilePicture : PF + "person/noAvatar.jpeg"}  
                        alt=""
                        /> )
                    
                    }

                {/* Profile Name */}
                <div className="profileInfo">
                    <h4 className="profileInfoName" >{user.username}</h4>
                    <span className="profileInfoDesc" >{user.desc}</span>
                </div>

                </div>
            </div>
        </div>
        
        </>
    )
}
