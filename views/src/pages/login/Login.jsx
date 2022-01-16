import {useContext, useRef} from 'react';
import "./login.css"
import {loginCall} from "../../apiCalls"
import { AuthContext } from "../../context/AuthContext"
import {CircularProgress} from "@material-ui/core"
import {Link} from "react-router-dom"
import { Info } from "@material-ui/icons"

export default function Login() {

    const email = useRef()
    const password = useRef()
    const {isFetching, dispatch} = useContext(AuthContext)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    //const {user} = useContext(AuthContext)
    
    const handleClick = (e) =>{
        //PreventDefault stops the page from reloading
        e.preventDefault();
        loginCall({email:email.current.value,password:password.current.value}, dispatch)
    }

    const handleForgotPassword = ()=>{
            alert("This feature has not yet been implemented. Please contact me on the following page to reset your password.")
    }
    
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo"><img className="loginLogo" src={PF+"default/logo-large.jpeg"} alt="" /></h3>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input 
                            placeholder="Email- Use demo@demo.com for demo" 
                            type="email" 
                            required 
                            className="loginInput" 
                            ref={email} 
                        />
                        <input 
                            placeholder="Password- Use password 'demo'" 
                            type="password" 
                            required 
                            minLength="4" 
                            className="loginInput" 
                            ref={password} 
                        />
                        <button 
                            className="loginButton" 
                            type="submit" 
                            disabled={isFetching} >
                            {isFetching ? <CircularProgress className="circular" size="25px"/> : "Log In"}
                        </button>
                        <span className="loginForgot" onClick={handleForgotPassword}>
                            <a href="https://jamesjewson.netlify.app/#contact" target="_blank" rel="noreferrer">Forgot Password?</a>
                        </span>
                        <Link to="/register" className="registerLink">
                            <button className="loginRegisterButton">
                                {isFetching ? (<CircularProgress className="circular" size="25px"/>) : (
                                    "Create a New Account"
                                )}
                            </button>
                        </Link>
                    </form>
                </div>
            </div>
            <div className="loginAbout">
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
