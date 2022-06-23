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
    
    const handleClick = (e) =>{
        //PreventDefault stops the page from reloading
        e.preventDefault();      
        if(email.current.value === "demo@demo.com"){
            if (window.confirm("By entering this website you agree to the terms and conditions.\nYou are posting on a public site that is a part of my portfolio.\n\nRules: Be nice. Be professional.") === true) {            
                loginCall({email:email.current.value,password:password.current.value}, dispatch)
            }
        }
        else{
            loginCall({email:email.current.value,password:password.current.value}, dispatch)
        }  
    }
    const handleForgotPassword = ()=>{
            alert("This feature has not yet been implemented. Please contact me on the following page to reset your password.")
    }
    
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginFormContainer">
                    {/* <span className="loginWelcome">Welcome to Faam!</span> */}
                    <form className="loginBox" onSubmit={handleClick}>
                        <input 
                            placeholder="Use demo@demo.com" 
                            type="email" 
                            required 
                            className="loginInput" 
                            ref={email} 
                        />
                        <input 
                            placeholder="Use password demodemo" 
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
                        <Link to="/register" className="loginInput">
                            <button className="loginRegisterButton">
                                {isFetching ? (<CircularProgress className="circular" size="25px"/>) : (
                                    "Create a New Account"
                                )}
                            </button>
                        </Link>
                    </form>
                </div>
            </div>
            <div className="loginFooter">
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
