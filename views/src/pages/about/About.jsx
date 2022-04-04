import "./about.css"
import {Link} from "react-router-dom"

import React from 'react'

export default function About() {
    // const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const PF = process.env.REACT_APP_PUBLIC_FOLDER



    return (
        <>
        <div className="aboutWrapper">
            <h1 className="logoWrapper">
                <Link to="/">
                    <img className="aboutLogo" src={PF+"default/faamLarge.jpg"} alt="logo"/>
                </Link>
            </h1>
            <div className="aboutlowerWrap">
                <div className="aboutSidebar">
                    <img src={PF + "default/friends.jpg"} alt="" className="aboutSideImg imgLeft" />
                    <img src={PF + "default/dinner.jpg"} alt="" className="aboutSideImg imgLeft" />
                </div>
                <div className="aboutTextWrapper">
                    <div className="headerWrap">
                        <h2 className="aboutH2" >About Us</h2>
                        <Link to="/" className="goBack" >Go Back</Link>
                    </div>
                    <section className="aboutQAndA">
                        <h4 className="aboutSubheader">This site is awesome! Where can I contact its creator?</h4>
                        <p className="aboutP">Creator James Jewson can be contacted <a href="https://jamesjewson.netlify.app/#contact" rel="noreferrer" target="_blank">here</a>.</p>
                    </section>
                    <section className="aboutQAndA">
                        <h4 className="aboutSubheader">What is Faam?</h4>
                        <p className="aboutP">Faam is a social media application created by software developer James Jewson. It is a continuous work in progress with semi-regular updates.</p>
                    </section>
                    <section className="aboutQAndA">
                        <h4 className="aboutSubheader">Can I see the source code?</h4>
                        <p className="aboutP"><a href="https://github.com/jamesjewson/Faamv1.0" rel="noreferrer" target="_blank">But of course!</a></p>
                    </section>
                    <section className="aboutQAndA">
                        <h4 className="aboutSubheader">What can I do on this site?</h4>
                        <p className="aboutP">This site allows you to do the following:</p>
                        <ul className="aboutList">
                            <li className="aboutListItem">Create a profile</li>
                            <li className="aboutListItem">Edit your profile settings (username, location, etc)</li>
                            <li className="aboutListItem">Customize your profile's profile picture and cover picture</li>
                            <li className="aboutListItem">Create, edit, and delete posts</li>
                            <li className="aboutListItem">Comment on posts</li>
                            <li className="aboutListItem">"Like" posts</li>
                            <li className="aboutListItem">Follow users</li>
                            <li className="aboutListItem">See all of a user's photos</li>
                            <li className="aboutListItem">Get notifications when a user follows you, and likes or comments on your post</li>
                        </ul>
                    </section>
                    <section className="aboutQAndA">
                        <h4 className="aboutSubheader">What technologies are used on this site?</h4>
                        <p className="aboutP">This site utilizes the following technologies:</p>
                        <ul className="aboutList">
                            <li className="aboutListItem">MongoDB</li>
                            <li className="aboutListItem">Express</li>
                            <li className="aboutListItem">React</li>
                            <li className="aboutListItem">Node.js</li>
                            <li className="aboutListItem">Cloudinary</li>
                        </ul>
                    </section>
                    <section className="aboutQAndA">
                        <h4 className="aboutSubheader">What future updates are expected?</h4>
                        <p className="aboutP">Potential future updates include the following:</p>
                        <ul className="aboutList">
                            <li className="aboutListItem">Instant Messaging</li>
                            <li className="aboutListItem">Securely Reset Password</li>
                            <li className="aboutListItem">Faam groups</li>
                        </ul>
                    </section>
                </div>
                <div className="aboutSidebar">
                    <img src={PF + "default/family.jpg"} alt="" className="aboutSideImg imgRight" />
                    <img src={PF + "default/mom-son.jpg"} alt="" className="aboutSideImg imgRight" />
                </div>
            </div>
            <div className="aboutBottom copyright">&copy; 2022 by James Jewson</div>
        </div>
        </>
    )
}
