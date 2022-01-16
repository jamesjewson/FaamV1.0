import axios from "axios"
import {useRef} from 'react'
import "./register.css"
import {useHistory} from "react-router"
import {Link} from "react-router-dom"



export default function Register() {

    const username = useRef()
    const email = useRef()
    const password = useRef()
    const passwordAgain = useRef()
    const history = useHistory()
    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    const handleClick = async (e) =>{
        //PreventDefault stops the page from reloading
        e.preventDefault();
        if(passwordAgain.current.value !== password.current.value){
            password.current.setCustomValidity("Passwords don't match")
        }else{
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            };
            try{          
                await axios.post("/auth/register", user);
                history.push("/login");
            }catch(err){
                console.log(err)
                alert("Username is already taken")
                username.current.select()
            } 
        }
    }


    return (
        <div className="register">
            <div className="loginWrapper">
                <div className="loginLeft">
                <h3 className="loginLogo"><img className="loginLogo" src={PF+"default/logo-large.jpeg"} alt="" /></h3>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input 
                            placeholder="Username" 
                            required
                            ref={username} 
                            className="loginInput" />
                        <input 
                            placeholder="Email" 
                            required 
                            ref={email} 
                            className="loginInput"
                            type="email" 
                        />
                        <input 
                            placeholder="Password" 
                            required 
                            ref={password} 
                            className="loginInput" 
                            type="password"
                            minLength="6"
                        />
                        <input 
                            placeholder="Password Again" 
                            required 
                            ref={passwordAgain} 
                            className="loginInput" 
                            type="password"
                        />
                        <button 
                            className="loginButton" type="submit">
                            Sign Up
                        </button>
                        <Link to="/login" className="loginLink">
                            <button 
                                className="loginRegisterButton">
                                Log into Your Account
                            </button>
                        </Link >
                    </form>
                </div>
            </div>
        </div>
    )
}
